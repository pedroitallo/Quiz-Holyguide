/*
  # Drop Funnel Star and Trial VSL Tables

  ## Summary
  Removes tables for deprecated funnels: star2, star3, star4, star5, and trialvsl.
  These funnels are no longer in use and their data is being archived.

  ## Tables Dropped
  - `step_views_funnel_star2` - Star funnel variant 2 tracking table
  - `step_views_funnel_star3` - Star funnel variant 3 tracking table
  - `step_views_funnel_star4` - Star funnel variant 4 tracking table
  - `step_views_funnel_star5` - Star funnel variant 5 tracking table

  ## Notes
  - All RLS policies are automatically dropped with the tables
  - This operation is safe as these funnels are being removed from the application
  - Data will be permanently deleted
*/

-- Drop tables if they exist
DROP TABLE IF EXISTS step_views_funnel_star2 CASCADE;
DROP TABLE IF EXISTS step_views_funnel_star3 CASCADE;
DROP TABLE IF EXISTS step_views_funnel_star4 CASCADE;
DROP TABLE IF EXISTS step_views_funnel_star5 CASCADE;
