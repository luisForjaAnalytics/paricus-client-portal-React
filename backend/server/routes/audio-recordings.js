import express from 'express';
import { authenticateToken, requirePermission } from '../middleware/auth-prisma.js';
import {
  getCallRecordings,
  getCallRecordingById,
  getAgentNames,
  getCallTypes,
  getTags,
  getCompanyNameFromTags,
  testConnection
} from '../services/mssql.js';
import { generateAudioDownloadUrl } from '../services/s3.js';
import NodeCache from 'node-cache';

const router = express.Router();

// Cache for audio URLs (TTL: 50 minutes, slightly less than S3 URL expiration)
const audioUrlCache = new NodeCache({ stdTTL: 3000, checkperiod: 600 });

/**
 * Test SQL Server connection
 * GET /api/audio-recordings/test
 */
router.get('/test', authenticateToken, requirePermission('admin_audio_recordings'), async (req, res) => {
  try {
    // Debug: Log environment variables
    console.log('MSSQL Environment Variables:');
    console.log('MSSQL_SERVER:', process.env.MSSQL_SERVER);
    console.log('MSSQL_USER:', process.env.MSSQL_USER);
    console.log('MSSQL_PASSWORD:', process.env.MSSQL_PASSWORD ? '***SET***' : 'NOT SET');
    console.log('MSSQL_DATABASE:', process.env.MSSQL_DATABASE);
    console.log('MSSQL_PORT:', process.env.MSSQL_PORT);

    const result = await testConnection();
    res.json(result);
  } catch (error) {
    console.error('Error testing SQL Server connection:', error);
    res.status(500).json({
      error: 'Failed to test database connection',
      message: error.message
    });
  }
});

/**
 * Get all call recordings with optional filters
 * GET /api/audio-recordings
 * Query params: page, limit, startDate, endDate, agentName, callType, customerPhone, interactionId
 */
router.get('/', authenticateToken, requirePermission('admin_audio_recordings'), async (req, res) => {
  const startTime = Date.now();
  console.log('[AUDIO-RECORDINGS] Request received');

  try {
    const {
      page = 1,
      limit = 50,
      startDate,
      endDate,
      agentName,
      callType,
      customerPhone,
      interactionId,
      company,
      hasAudio
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    console.log(`[AUDIO-RECORDINGS] Params: page=${pageNum}, limit=${limitNum}, offset=${offset}`);

    // Build filters object
    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (agentName) filters.agentName = agentName;
    if (callType) filters.callType = callType;
    if (customerPhone) filters.customerPhone = customerPhone;
    if (interactionId) filters.interactionId = interactionId;
    if (company) filters.company = company;
    if (hasAudio !== undefined) filters.hasAudio = hasAudio;

    console.log('[AUDIO-RECORDINGS] Filters:', JSON.stringify(filters));
    console.log('[AUDIO-RECORDINGS] Querying SQL Server...');

    const queryStartTime = Date.now();
    const result = await getCallRecordings(filters, limitNum, offset);
    const queryDuration = Date.now() - queryStartTime;

    console.log(`[AUDIO-RECORDINGS] Query completed in ${queryDuration}ms, found ${result.recordings.length} recordings`);

    // Don't generate URLs upfront - send recordings without URLs for faster loading
    const recordings = result.recordings.map(recording => ({
      ...recording,
      customer_phone: recording.customer_phone_number, // Map to expected frontend field name
      company_name: getCompanyNameFromTags(recording.tags), // Add company name
      audioUrl: null, // Will be generated on-demand
      start_time: recording.start_time,
      end_time: recording.end_time
    }));

    const totalDuration = Date.now() - startTime;
    console.log(`[AUDIO-RECORDINGS] Total request time: ${totalDuration}ms`);

    res.json({
      data: recordings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalCount: result.totalCount,
        totalPages: Math.ceil(result.totalCount / limitNum)
      }
    });
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`[AUDIO-RECORDINGS] Error after ${totalDuration}ms:`, error);

    // Check if it's a configuration error
    if (error.message.includes('not configured')) {
      return res.status(503).json({
        error: 'Database not configured',
        message: 'SQL Server credentials are not set. Please configure MSSQL settings in .env'
      });
    }

    res.status(500).json({
      error: 'Failed to fetch audio recordings',
      message: error.message
    });
  }
});

/**
 * Get audio URL for a specific recording (on-demand with caching)
 * GET /api/audio-recordings/:interactionId/audio-url
 */
router.get('/:interactionId/audio-url', authenticateToken, requirePermission('admin_audio_recordings'), async (req, res) => {
  try {
    const { interactionId } = req.params;

    // Check cache first
    const cacheKey = `audio_url_${interactionId}`;
    const cachedUrl = audioUrlCache.get(cacheKey);

    if (cachedUrl) {
      console.log(`[AUDIO-URL] Cache hit for ${interactionId}`);
      return res.json({ audioUrl: cachedUrl });
    }

    console.log(`[AUDIO-URL] Cache miss for ${interactionId}, fetching from database...`);

    const recording = await getCallRecordingById(interactionId);

    if (!recording) {
      return res.status(404).json({
        error: 'Recording not found',
        message: `No recording found with interaction ID: ${interactionId}`
      });
    }

    if (!recording.audiofilename) {
      return res.status(404).json({
        error: 'Audio file not found',
        message: 'No audio file associated with this recording'
      });
    }

    // Generate pre-signed URL on-demand
    try {
      const audioUrl = await generateAudioDownloadUrl(recording.audiofilename);

      // Cache the URL for 50 minutes (slightly less than 1 hour expiration)
      audioUrlCache.set(cacheKey, audioUrl);

      res.json({ audioUrl });
    } catch (error) {
      console.error(`Error generating URL for ${recording.audiofilename}:`, error);
      res.status(500).json({
        error: 'Failed to generate audio URL',
        message: error.message
      });
    }
  } catch (error) {
    console.error('Error generating audio URL:', error);
    res.status(500).json({
      error: 'Failed to generate audio URL',
      message: error.message
    });
  }
});

/**
 * Get a single call recording by interaction ID
 * GET /api/audio-recordings/:interactionId
 */
router.get('/:interactionId', authenticateToken, requirePermission('admin_audio_recordings'), async (req, res) => {
  try {
    const { interactionId } = req.params;

    const recording = await getCallRecordingById(interactionId);

    if (!recording) {
      return res.status(404).json({
        error: 'Recording not found',
        message: `No recording found with interaction ID: ${interactionId}`
      });
    }

    // Map field names for frontend
    recording.customer_phone = recording.customer_phone_number;
    recording.company_name = getCompanyNameFromTags(recording.tags);

    res.json({ data: recording });
  } catch (error) {
    console.error('Error fetching audio recording:', error);
    res.status(500).json({
      error: 'Failed to fetch audio recording',
      message: error.message
    });
  }
});

/**
 * Get list of unique agent names
 * GET /api/audio-recordings/filters/agents
 */
router.get('/filters/agents', authenticateToken, requirePermission('admin_audio_recordings'), async (req, res) => {
  try {
    const agents = await getAgentNames();
    res.json({ data: agents });
  } catch (error) {
    console.error('Error fetching agent names:', error);
    res.status(500).json({
      error: 'Failed to fetch agent names',
      message: error.message
    });
  }
});

/**
 * Get list of unique call types
 * GET /api/audio-recordings/filters/call-types
 */
router.get('/filters/call-types', authenticateToken, requirePermission('admin_audio_recordings'), async (req, res) => {
  try {
    const callTypes = await getCallTypes();
    res.json({ data: callTypes });
  } catch (error) {
    console.error('Error fetching call types:', error);
    res.status(500).json({
      error: 'Failed to fetch call types',
      message: error.message
    });
  }
});

/**
 * Get list of unique tags
 * GET /api/audio-recordings/filters/tags
 */
router.get('/filters/tags', authenticateToken, requirePermission('admin_audio_recordings'), async (req, res) => {
  try {
    const tags = await getTags();
    // Map to include company names
    const tagsWithCompanies = tags.map(tag => ({
      tag: tag,
      company_name: getCompanyNameFromTags(tag)
    }));
    res.json({ data: tagsWithCompanies });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      error: 'Failed to fetch tags',
      message: error.message
    });
  }
});

export default router;
