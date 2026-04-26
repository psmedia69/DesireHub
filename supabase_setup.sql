/*
  SUPABASE HEAT SCORE SETUP
  
  Run this SQL in your Supabase SQL Editor to implement the heat score system.
*/

-- 1. Add recent_clicks column to models table
-- This should ideally be reset every 24h by an edge function 
-- or calculated using a separate events table for better accuracy.
ALTER TABLE models ADD COLUMN IF NOT EXISTS recent_clicks_24h INTEGER DEFAULT 0;
-- Remove old country code column
ALTER TABLE models DROP COLUMN IF EXISTS country_code;

ALTER TABLE models ADD COLUMN IF NOT EXISTS country_name TEXT;
ALTER TABLE models ADD COLUMN IF NOT EXISTS display_category TEXT;
ALTER TABLE models ADD COLUMN IF NOT EXISTS followers_count TEXT;

-- 2. Create a function to fetch models with calculated heat score
-- score = (clicks * 2) + views + (recent_clicks_last_24h * 3)
CREATE OR REPLACE FUNCTION get_trending_models()
RETURNS SETOF models AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM models
  ORDER BY ((clicks * 2) + views + (recent_clicks_24h * 3)) DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- 3. (Optional) Create a view for easier querying
CREATE OR REPLACE VIEW trending_models_view AS
SELECT 
  *,
  ((clicks * 2) + views + (recent_clicks_24h * 3)) as heat_score
FROM models
ORDER BY heat_score DESC;
