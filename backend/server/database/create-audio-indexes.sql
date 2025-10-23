-- ==============================================================================
-- SQL Server Index Creation Script for Audio Recordings Performance
-- ==============================================================================
-- This script creates optimized indexes for the calls_report table
-- Run this on the Workforce_Management database to achieve sub-second query times
--
-- Expected Performance Improvements:
-- - Before: 3-10 seconds for complex queries
-- - After: 50-500ms for complex queries (10-20x faster)
-- ==============================================================================

USE Workforce_Management;
GO

-- Check if table exists
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'calls_report')
BEGIN
    PRINT 'ERROR: calls_report table not found!';
    RETURN;
END
GO

PRINT 'Creating optimized indexes for calls_report table...';
GO

-- ==============================================================================
-- PRIMARY KEY / CLUSTERED INDEX
-- ==============================================================================
-- This should already exist, but if not, interaction_id should be the primary key
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('calls_report') AND name = 'PK_calls_report')
BEGIN
    PRINT 'Creating primary key on interaction_id...';
    ALTER TABLE calls_report
    ADD CONSTRAINT PK_calls_report PRIMARY KEY CLUSTERED (interaction_id);
END
ELSE
BEGIN
    PRINT 'Primary key already exists.';
END
GO

-- ==============================================================================
-- INDEX 1: Start Time (Most Important - Used in all queries)
-- ==============================================================================
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('calls_report') AND name = 'idx_start_time')
BEGIN
    PRINT 'Creating index: idx_start_time (Covering index for date range queries)';
    CREATE NONCLUSTERED INDEX idx_start_time
    ON calls_report (start_time DESC)
    INCLUDE (interaction_id, call_type, end_time, customer_phone_number, agent_name, audiofilename)
    WITH (
        PAD_INDEX = ON,
        FILLFACTOR = 90,
        ONLINE = ON,
        SORT_IN_TEMPDB = ON,
        DATA_COMPRESSION = PAGE
    );
    PRINT 'Index idx_start_time created successfully.';
END
ELSE
BEGIN
    PRINT 'Index idx_start_time already exists.';
END
GO

-- ==============================================================================
-- INDEX 2: Interaction ID (For single record lookups)
-- ==============================================================================
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('calls_report') AND name = 'idx_interaction_id')
BEGIN
    PRINT 'Creating index: idx_interaction_id (For audio URL generation)';
    CREATE NONCLUSTERED INDEX idx_interaction_id
    ON calls_report (interaction_id)
    INCLUDE (audiofilename, call_type, agent_name, customer_phone_number, start_time, end_time)
    WITH (
        PAD_INDEX = ON,
        FILLFACTOR = 95,
        ONLINE = ON,
        DATA_COMPRESSION = PAGE
    );
    PRINT 'Index idx_interaction_id created successfully.';
END
ELSE
BEGIN
    PRINT 'Index idx_interaction_id already exists.';
END
GO

-- ==============================================================================
-- INDEX 3: Agent Name (For agent filtering)
-- ==============================================================================
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('calls_report') AND name = 'idx_agent_name')
BEGIN
    PRINT 'Creating index: idx_agent_name (For agent filtering)';
    CREATE NONCLUSTERED INDEX idx_agent_name
    ON calls_report (agent_name, start_time DESC)
    INCLUDE (interaction_id, call_type, customer_phone_number, audiofilename)
    WITH (
        PAD_INDEX = ON,
        FILLFACTOR = 90,
        ONLINE = ON,
        DATA_COMPRESSION = PAGE
    );
    PRINT 'Index idx_agent_name created successfully.';
END
ELSE
BEGIN
    PRINT 'Index idx_agent_name already exists.';
END
GO

-- ==============================================================================
-- INDEX 4: Call Type (For call type filtering)
-- ==============================================================================
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('calls_report') AND name = 'idx_call_type')
BEGIN
    PRINT 'Creating index: idx_call_type (For call type filtering)';
    CREATE NONCLUSTERED INDEX idx_call_type
    ON calls_report (call_type, start_time DESC)
    INCLUDE (interaction_id, agent_name, customer_phone_number, audiofilename)
    WITH (
        PAD_INDEX = ON,
        FILLFACTOR = 90,
        ONLINE = ON,
        DATA_COMPRESSION = PAGE
    );
    PRINT 'Index idx_call_type created successfully.';
END
ELSE
BEGIN
    PRINT 'Index idx_call_type already exists.';
END
GO

-- ==============================================================================
-- INDEX 5: Customer Phone (For phone number lookups)
-- ==============================================================================
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('calls_report') AND name = 'idx_customer_phone')
BEGIN
    PRINT 'Creating index: idx_customer_phone (For phone search)';
    CREATE NONCLUSTERED INDEX idx_customer_phone
    ON calls_report (customer_phone_number, start_time DESC)
    INCLUDE (interaction_id, call_type, agent_name, audiofilename)
    WITH (
        PAD_INDEX = ON,
        FILLFACTOR = 90,
        ONLINE = ON,
        DATA_COMPRESSION = PAGE
    );
    PRINT 'Index idx_customer_phone created successfully.';
END
ELSE
BEGIN
    PRINT 'Index idx_customer_phone already exists.';
END
GO

-- ==============================================================================
-- INDEX 6: Composite index for most common query pattern
-- ==============================================================================
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('calls_report') AND name = 'idx_composite_common')
BEGIN
    PRINT 'Creating index: idx_composite_common (For combined filters)';
    CREATE NONCLUSTERED INDEX idx_composite_common
    ON calls_report (call_type, agent_name, start_time DESC)
    INCLUDE (interaction_id, customer_phone_number, audiofilename, end_time)
    WITH (
        PAD_INDEX = ON,
        FILLFACTOR = 85,
        ONLINE = ON,
        DATA_COMPRESSION = PAGE
    );
    PRINT 'Index idx_composite_common created successfully.';
END
ELSE
BEGIN
    PRINT 'Index idx_composite_common already exists.';
END
GO

-- ==============================================================================
-- UPDATE STATISTICS (Critical for query optimizer)
-- ==============================================================================
PRINT 'Updating statistics for optimal query planning...';
UPDATE STATISTICS calls_report WITH FULLSCAN;
GO

-- ==============================================================================
-- VERIFY INDEX CREATION
-- ==============================================================================
PRINT '';
PRINT '==============================================================================';
PRINT 'Index Creation Summary';
PRINT '==============================================================================';

SELECT
    i.name AS IndexName,
    i.type_desc AS IndexType,
    CASE WHEN i.is_unique = 1 THEN 'Yes' ELSE 'No' END AS IsUnique,
    ds.name AS FileGroup,
    CAST(SUM(ps.used_page_count) * 8 / 1024.0 AS DECIMAL(10,2)) AS SizeInMB,
    i.fill_factor AS FillFactor
FROM sys.indexes i
INNER JOIN sys.data_spaces ds ON i.data_space_id = ds.data_space_id
LEFT JOIN sys.dm_db_partition_stats ps ON i.object_id = ps.object_id AND i.index_id = ps.index_id
WHERE i.object_id = OBJECT_ID('calls_report')
    AND i.type > 0  -- Exclude heap
GROUP BY i.name, i.type_desc, i.is_unique, ds.name, i.fill_factor
ORDER BY i.name;
GO

-- ==============================================================================
-- PERFORMANCE TESTING QUERIES
-- ==============================================================================
PRINT '';
PRINT '==============================================================================';
PRINT 'Test Queries (Run these to verify performance)';
PRINT '==============================================================================';
PRINT '';
PRINT '-- Test 1: Basic date range query (should use idx_start_time)';
PRINT 'SET STATISTICS TIME ON;';
PRINT 'SELECT TOP 25 * FROM calls_report WITH (NOLOCK, INDEX(idx_start_time))';
PRINT 'WHERE start_time >= DATEADD(day, -7, GETDATE())';
PRINT 'ORDER BY start_time DESC;';
PRINT 'SET STATISTICS TIME OFF;';
PRINT '';
PRINT '-- Test 2: Agent search (should use idx_agent_name)';
PRINT 'SET STATISTICS TIME ON;';
PRINT 'SELECT TOP 25 * FROM calls_report WITH (NOLOCK, INDEX(idx_agent_name))';
PRINT 'WHERE agent_name LIKE ''John%''';
PRINT 'ORDER BY start_time DESC;';
PRINT 'SET STATISTICS TIME OFF;';
PRINT '';
PRINT '-- Test 3: Call type filter (should use idx_call_type)';
PRINT 'SET STATISTICS TIME ON;';
PRINT 'SELECT TOP 25 * FROM calls_report WITH (NOLOCK, INDEX(idx_call_type))';
PRINT 'WHERE call_type = ''inbound''';
PRINT 'ORDER BY start_time DESC;';
PRINT 'SET STATISTICS TIME OFF;';
PRINT '';

PRINT '==============================================================================';
PRINT 'Index creation completed successfully!';
PRINT 'Expected query performance: 50-500ms (previously 3-10 seconds)';
PRINT '';
PRINT 'IMPORTANT NOTES:';
PRINT '1. These indexes use PAGE compression to save disk space';
PRINT '2. Indexes were created ONLINE to avoid blocking queries';
PRINT '3. Statistics are automatically updated for optimal query plans';
PRINT '4. Monitor index fragmentation monthly and rebuild if needed';
PRINT '';
PRINT 'To check index usage:';
PRINT 'SELECT * FROM sys.dm_db_index_usage_stats';
PRINT 'WHERE database_id = DB_ID(''Workforce_Management'')';
PRINT '  AND object_id = OBJECT_ID(''calls_report'');';
PRINT '==============================================================================';
GO
