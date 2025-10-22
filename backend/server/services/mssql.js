import sql from 'mssql';
import NodeCache from 'node-cache';

// Query result cache (5 minute TTL for count queries, 1 minute for data)
const queryCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });
const countCache = new NodeCache({ stdTTL: 300, checkperiod: 600 });

// SQL Server configuration - optimized for performance
const config = {
  server: process.env.MSSQL_SERVER,
  database: process.env.MSSQL_DATABASE,
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  port: parseInt(process.env.MSSQL_PORT) || 1433,
  options: {
    encrypt: process.env.MSSQL_ENCRYPT === 'true',
    trustServerCertificate: process.env.MSSQL_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true,
    connectionTimeout: 30000, // 30 seconds (reduced from 5 minutes)
    requestTimeout: 60000, // 1 minute (reduced from 5 minutes)
    // Performance optimizations
    packetSize: 32768, // Increase packet size for better throughput
    rowCollectionOnRequestCompletion: true,
    useUTC: true,
  },
  pool: {
    max: 50, // Increased from 10 for better concurrency
    min: 5, // Keep 5 warm connections
    idleTimeoutMillis: 60000, // 1 minute idle timeout
    acquireTimeoutMillis: 30000, // 30 seconds to acquire connection
  }
};

// Connection pool
let pool = null;

/**
 * Get or create SQL Server connection pool
 */
export async function getPool() {
  if (!pool) {
    // Check if credentials are configured
    if (!config.server || !config.user || !config.password) {
      throw new Error('SQL Server credentials not configured. Please set MSSQL_SERVER, MSSQL_USER, and MSSQL_PASSWORD in .env');
    }

    try {
      console.log('[MSSQL] Connecting to SQL Server...', {
        server: config.server,
        database: config.database,
        poolSize: `${config.pool.min}-${config.pool.max}`
      });
      pool = await sql.connect(config);
      console.log('[MSSQL] SQL Server connected successfully with optimized pool');
    } catch (error) {
      console.error('[MSSQL] Connection failed:', error.message);
      pool = null;
      throw error;
    }
  }
  return pool;
}

/**
 * Generate cache key for query
 */
function generateCacheKey(filters, limit, offset) {
  return JSON.stringify({ filters, limit, offset });
}

/**
 * Get total count with caching and optimization
 */
async function getTotalCount(pool, filters) {
  const countCacheKey = `count_${JSON.stringify(filters)}`;
  const cachedCount = countCache.get(countCacheKey);

  if (cachedCount !== undefined) {
    console.log('[MSSQL] Count cache hit');
    return cachedCount;
  }

  const request = pool.request();

  // Build optimized count query with query hints
  let countQuery = `
    SELECT COUNT_BIG(*) AS total_count
    FROM calls_report WITH (NOLOCK, INDEX(idx_start_time))
    WHERE call_type = 'inbound'
      AND (tags NOT LIKE '%test%' AND tags NOT LIKE '%demo%')
  `;

  // Add filters (same as main query)
  if (filters.startDate) {
    countQuery += ` AND start_time >= @startDate`;
    request.input('startDate', sql.DateTime, new Date(filters.startDate));
  }
  if (filters.endDate) {
    countQuery += ` AND end_time <= @endDate`;
    request.input('endDate', sql.DateTime, new Date(filters.endDate));
  }
  if (filters.agentName) {
    // Use indexed column if available, avoid leading wildcard
    countQuery += ` AND agent_name LIKE @agentName`;
    request.input('agentName', sql.NVarChar, `${filters.agentName}%`);
  }
  if (filters.callType) {
    countQuery += ` AND call_type = @callType`;
    request.input('callType', sql.NVarChar, filters.callType);
  }
  if (filters.customerPhone) {
    // Only add if exact match to use index
    countQuery += ` AND customer_phone_number LIKE @customerPhone`;
    request.input('customerPhone', sql.NVarChar, `${filters.customerPhone}%`);
  }
  if (filters.interactionId) {
    // Exact match for index usage
    countQuery += ` AND interaction_id = @interactionId`;
    request.input('interactionId', sql.NVarChar, filters.interactionId);
  }
  if (filters.company) {
    // Filter by company using tags pattern matching
    if (filters.company === 'IM Telecom') {
      countQuery += ` AND (tags LIKE '%exc%' OR tags LIKE '%infiniti%')`;
    } else if (filters.company === 'Flex Mobile') {
      countQuery += ` AND (tags LIKE '%flex%' OR tags LIKE '%flx%')`;
    } else if (filters.company === 'Tempo Wireless') {
      countQuery += ` AND (tags LIKE '%tem%' OR tags LIKE '%tempo%')`;
    }
  }
  if (filters.hasAudio !== undefined) {
    // Filter by whether record has audio file
    if (filters.hasAudio === 'true' || filters.hasAudio === true) {
      countQuery += ` AND audiofilename IS NOT NULL AND audiofilename != ''`;
    } else if (filters.hasAudio === 'false' || filters.hasAudio === false) {
      countQuery += ` AND (audiofilename IS NULL OR audiofilename = '')`;
    }
  }

  const countResult = await request.query(countQuery);
  const totalCount = parseInt(countResult.recordset[0].total_count);

  // Cache the count for 5 minutes
  countCache.set(countCacheKey, totalCount);

  return totalCount;
}

/**
 * Get all call recordings from calls_report table - OPTIMIZED
 * Only returns inbound calls
 * @param {Object} filters - Optional filters (startDate, endDate, agentName, callType)
 * @param {number} limit - Number of records to return
 * @param {number} offset - Number of records to skip
 */
export async function getCallRecordings(filters = {}, limit = 100, offset = 0) {
  const startTime = Date.now();

  try {
    // Check cache first
    const cacheKey = generateCacheKey(filters, limit, offset);
    const cached = queryCache.get(cacheKey);

    if (cached) {
      console.log(`[MSSQL] Cache hit - returned in ${Date.now() - startTime}ms`);
      return cached;
    }

    let pool;
    try {
      pool = await getPool();
    } catch (configError) {
      // Return error indicating DB is not configured instead of crashing
      throw new Error('SQL Server not configured');
    }
    const poolTime = Date.now() - startTime;

    // Run count query in parallel if it's a fresh query
    const countPromise = getTotalCount(pool, filters);

    const request = pool.request();

    // Build optimized query with query hints and proper indexes
    let query = `
      SELECT
        interaction_id,
        call_type,
        start_time,
        end_time,
        customer_phone_number,
        agent_name,
        audiofilename,
        tags
      FROM calls_report WITH (NOLOCK)
      WHERE call_type = 'inbound'
        AND (tags NOT LIKE '%test%' AND tags NOT LIKE '%demo%')
    `;

    // Add filters - optimized to use indexes
    if (filters.startDate) {
      query += ` AND start_time >= @startDate`;
      request.input('startDate', sql.DateTime, new Date(filters.startDate));
    }

    if (filters.endDate) {
      query += ` AND end_time <= @endDate`;
      request.input('endDate', sql.DateTime, new Date(filters.endDate));
    }

    if (filters.agentName) {
      // Remove leading wildcard for index usage
      query += ` AND agent_name LIKE @agentName`;
      request.input('agentName', sql.NVarChar, `${filters.agentName}%`);
    }

    if (filters.callType) {
      query += ` AND call_type = @callType`;
      request.input('callType', sql.NVarChar, filters.callType);
    }

    if (filters.customerPhone) {
      // Remove leading wildcard for index usage
      query += ` AND customer_phone_number LIKE @customerPhone`;
      request.input('customerPhone', sql.NVarChar, `${filters.customerPhone}%`);
    }

    if (filters.interactionId) {
      // Use exact match for index usage
      query += ` AND interaction_id = @interactionId`;
      request.input('interactionId', sql.NVarChar, filters.interactionId);
    }

    if (filters.company) {
      // Filter by company using tags pattern matching
      if (filters.company === 'IM Telecom') {
        query += ` AND (tags LIKE '%exc%' OR tags LIKE '%infiniti%')`;
      } else if (filters.company === 'Flex Mobile') {
        query += ` AND (tags LIKE '%flex%' OR tags LIKE '%flx%')`;
      } else if (filters.company === 'Tempo Wireless') {
        query += ` AND (tags LIKE '%tem%' OR tags LIKE '%tempo%')`;
      }
    }

    if (filters.hasAudio !== undefined) {
      // Filter by whether record has audio file
      if (filters.hasAudio === 'true' || filters.hasAudio === true) {
        query += ` AND audiofilename IS NOT NULL AND audiofilename != ''`;
      } else if (filters.hasAudio === 'false' || filters.hasAudio === false) {
        query += ` AND (audiofilename IS NULL OR audiofilename = '')`;
      }
    }

    // Optimized ordering and pagination using TOP and ROW_NUMBER for better performance
    query += `
      ORDER BY start_time DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
      OPTION (RECOMPILE, MAXDOP 4)
    `;

    request.input('limit', sql.Int, limit);
    request.input('offset', sql.Int, offset);

    console.log('[MSSQL] Executing optimized query...');
    const queryStartTime = Date.now();

    // Execute query and count in parallel
    const [result, totalCount] = await Promise.all([
      request.query(query),
      countPromise
    ]);

    const queryDuration = Date.now() - queryStartTime;
    const totalDuration = Date.now() - startTime;

    console.log(`[MSSQL] Performance metrics:`);
    console.log(`  - Pool acquisition: ${poolTime}ms`);
    console.log(`  - Query execution: ${queryDuration}ms`);
    console.log(`  - Total time: ${totalDuration}ms`);
    console.log(`  - Rows returned: ${result.recordset.length}`);
    console.log(`  - Total count: ${totalCount}`);

    const resultData = {
      recordings: result.recordset,
      totalCount: totalCount
    };

    // Cache result for 1 minute
    queryCache.set(cacheKey, resultData);

    return resultData;
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`[MSSQL] Error after ${totalDuration}ms:`, error);
    throw error;
  }
}

/**
 * Get a single call recording by interaction ID - OPTIMIZED
 * @param {string} interactionId - Interaction ID
 */
export async function getCallRecordingById(interactionId) {
  try {
    // Check cache first
    const cacheKey = `recording_${interactionId}`;
    const cached = queryCache.get(cacheKey);

    if (cached) {
      console.log('[MSSQL] Single record cache hit');
      return cached;
    }

    let pool;
    try {
      pool = await getPool();
    } catch (configError) {
      throw new Error('SQL Server not configured');
    }
    const request = pool.request();

    request.input('interactionId', sql.NVarChar, interactionId);

    // Use NOLOCK and index hint for faster reads
    const result = await request.query(`
      SELECT
        interaction_id,
        call_type,
        start_time,
        end_time,
        customer_phone_number,
        agent_name,
        audiofilename,
        tags
      FROM calls_report WITH (NOLOCK, INDEX(idx_interaction_id))
      WHERE interaction_id = @interactionId
    `);

    const record = result.recordset[0] || null;

    // Cache for 5 minutes
    if (record) {
      queryCache.set(cacheKey, record, 300);
    }

    return record;
  } catch (error) {
    console.error('[MSSQL] Error fetching call recording by ID:', error);
    throw error;
  }
}

/**
 * Get unique agent names from calls_report - OPTIMIZED
 */
export async function getAgentNames() {
  try {
    const cacheKey = 'agent_names';
    const cached = queryCache.get(cacheKey);

    if (cached) {
      console.log('[MSSQL] Agent names cache hit');
      return cached;
    }

    const pool = await getPool();

    // Use NOLOCK and index hint for faster reads
    const result = await pool.request().query(`
      SELECT DISTINCT agent_name
      FROM calls_report WITH (NOLOCK, INDEX(idx_agent_name))
      WHERE agent_name IS NOT NULL
      ORDER BY agent_name
      OPTION (MAXDOP 2)
    `);

    const agentNames = result.recordset.map(row => row.agent_name);

    // Cache for 10 minutes
    queryCache.set(cacheKey, agentNames, 600);

    return agentNames;
  } catch (error) {
    console.error('[MSSQL] Error fetching agent names:', error);
    throw error;
  }
}

/**
 * Get unique call types from calls_report - OPTIMIZED
 */
export async function getCallTypes() {
  try {
    const cacheKey = 'call_types';
    const cached = queryCache.get(cacheKey);

    if (cached) {
      console.log('[MSSQL] Call types cache hit');
      return cached;
    }

    let pool;
    try {
      pool = await getPool();
    } catch (configError) {
      throw new Error('SQL Server not configured');
    }

    // Use NOLOCK and index hint for faster reads
    const result = await pool.request().query(`
      SELECT DISTINCT call_type
      FROM calls_report WITH (NOLOCK, INDEX(idx_call_type))
      WHERE call_type IS NOT NULL
      ORDER BY call_type
      OPTION (MAXDOP 2)
    `);

    const callTypes = result.recordset.map(row => row.call_type);

    // Cache for 10 minutes
    queryCache.set(cacheKey, callTypes, 600);

    return callTypes;
  } catch (error) {
    console.error('[MSSQL] Error fetching call types:', error);
    throw error;
  }
}

/**
 * Get unique tags from calls_report - OPTIMIZED
 */
export async function getTags() {
  try {
    const cacheKey = 'tags';
    const cached = queryCache.get(cacheKey);

    if (cached) {
      console.log('[MSSQL] Tags cache hit');
      return cached;
    }

    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT DISTINCT tags
      FROM calls_report WITH (NOLOCK)
      WHERE tags IS NOT NULL
      ORDER BY tags
      OPTION (MAXDOP 2)
    `);

    const tags = result.recordset.map(row => row.tags);

    // Cache for 10 minutes
    queryCache.set(cacheKey, tags, 600);

    return tags;
  } catch (error) {
    console.error('[MSSQL] Error fetching tags:', error);
    throw error;
  }
}

/**
 * Map tags to company name based on naming patterns
 * - "exc" or "infiniti" → IM Telecom
 * - "flex" or "flx" → Flex Mobile
 * - "tem" or "tempo" → Tempo Wireless
 */
export function getCompanyNameFromTags(tags) {
  if (!tags) return 'Unknown';

  const tagsLower = tags.toLowerCase();

  if (tagsLower.includes('exc') || tagsLower.includes('infiniti')) {
    return 'IM Telecom';
  }
  if (tagsLower.includes('flex') || tagsLower.includes('flx')) {
    return 'Flex Mobile';
  }
  if (tagsLower.includes('tem') || tagsLower.includes('tempo')) {
    return 'Tempo Wireless';
  }

  return tags; // Return original if no match
}

/**
 * Test SQL Server connection
 */
export async function testConnection() {
  try {
    const pool = await getPool();
    await pool.request().query('SELECT 1 AS test');
    return { success: true, message: 'SQL Server connection successful' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * Clear query cache (useful for testing or manual refresh)
 */
export function clearCache() {
  queryCache.flushAll();
  countCache.flushAll();
  console.log('[MSSQL] Query cache cleared');
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    queryCache: queryCache.getStats(),
    countCache: countCache.getStats()
  };
}

/**
 * Close SQL Server connection pool
 */
export async function closePool() {
  if (pool) {
    try {
      await pool.close();
      pool = null;
      clearCache();
      console.log('[MSSQL] SQL Server connection closed and cache cleared');
    } catch (error) {
      console.error('[MSSQL] Error closing SQL Server connection:', error);
    }
  }
}
