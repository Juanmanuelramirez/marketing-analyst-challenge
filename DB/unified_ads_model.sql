/*
==================================================================================
Unified Advertising Data Model Script
==================================================================================
Platform: Google BigQuery (Standard SQL)
Purpose: Unify data from Facebook, Google, and TikTok into a single table/view
for cross-channel performance analysis.
*/

-- Step 1: Process and standardize Facebook Ads data
WITH facebook_data AS (
  SELECT
    'Facebook' AS platform,
    PARSE_DATE('%Y-%m-%d', date) AS date,
    campaign_id,
    campaign_name,
    ad_set_id AS ad_group_id,
    ad_set_name AS ad_group_name,
    CAST(impressions AS INT64) AS impressions,
    CAST(clicks AS INT64) AS clicks,
    CAST(spend AS FLOAT64) AS spend,
    CAST(conversions AS INT64) AS conversions,
    CAST(NULL AS FLOAT64) AS revenue  -- FB provides no revenue in this dataset
  FROM
    `your-project.your_dataset.01_facebook_ads`
),

-- Step 2: Process and standardize Google Ads data
google_data AS (
  SELECT
    'Google' AS platform,
    PARSE_DATE('%Y-%m-%d', date) AS date,
    campaign_id,
    campaign_name,
    ad_group_id,
    ad_group_name,
    CAST(impressions AS INT64) AS impressions,
    CAST(clicks AS INT64) AS clicks,
    CAST(cost AS FLOAT64) AS spend,  -- Homogenize 'cost' to 'spend'
    CAST(conversions AS INT64) AS conversions,
    CAST(conversion_value AS FLOAT64) AS revenue -- Google provides revenue
  FROM
    `your-project.your_dataset.02_google_ads`
),

-- Step 3: Process and standardize TikTok Ads data
tiktok_data AS (
  SELECT
    'TikTok' AS platform,
    PARSE_DATE('%Y-%m-%d', date) AS date,
    campaign_id,
    campaign_name,
    adgroup_id AS ad_group_id,      -- Homogenize 'adgroup_id'
    adgroup_name AS ad_group_name,  -- Homogenize 'adgroup_name'
    CAST(impressions AS INT64) AS impressions,
    CAST(clicks AS INT64) AS clicks,
    CAST(cost AS FLOAT64) AS spend,  -- Homogenize 'cost' to 'spend'
    CAST(conversions AS INT64) AS conversions,
    CAST(NULL AS FLOAT64) AS revenue  -- TikTok provides no revenue in this dataset
  FROM
    `your-project.your_dataset.03_tiktok_ads`
)

-- Step 4: Union all data sources
SELECT * FROM facebook_data
UNION ALL
SELECT * FROM google_data
UNION ALL
SELECT * FROM tiktok_data;