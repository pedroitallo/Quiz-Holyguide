/*
  # Add step tracking columns to quiz_results table

  1. New Columns
    - `video_step_viewed` (boolean, default false)
    - `testimonials_step_viewed` (boolean, default false)
    - `name_collection_step_viewed` (boolean, default false)
    - `birth_data_collection_step_viewed` (boolean, default false)
    - `love_situation_step_viewed` (boolean, default false)
    - `palm_reading_results_step_viewed` (boolean, default false)
    - `loading_revelation_step_viewed` (boolean, default false)
    - `paywall_step_viewed` (boolean, default false)

  2. Purpose
    - Track which specific steps users have viewed in the quiz
    - Enable detailed analytics on user engagement per step
    - Maintain existing functionality while adding granular tracking

  3. Notes
    - All columns default to false
    - Updates are asynchronous and won't impact quiz flow
    - Existing pitch_step_viewed and checkout_step_clicked columns remain unchanged
*/

-- Add step tracking columns
DO $$
BEGIN
  -- Video step (step 1)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_results' AND column_name = 'video_step_viewed'
  ) THEN
    ALTER TABLE quiz_results ADD COLUMN video_step_viewed boolean DEFAULT false;
  END IF;

  -- Testimonials step (step 2)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_results' AND column_name = 'testimonials_step_viewed'
  ) THEN
    ALTER TABLE quiz_results ADD COLUMN testimonials_step_viewed boolean DEFAULT false;
  END IF;

  -- Name collection step (step 3)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_results' AND column_name = 'name_collection_step_viewed'
  ) THEN
    ALTER TABLE quiz_results ADD COLUMN name_collection_step_viewed boolean DEFAULT false;
  END IF;

  -- Birth data collection step (step 4)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_results' AND column_name = 'birth_data_collection_step_viewed'
  ) THEN
    ALTER TABLE quiz_results ADD COLUMN birth_data_collection_step_viewed boolean DEFAULT false;
  END IF;

  -- Love situation step (step 5)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_results' AND column_name = 'love_situation_step_viewed'
  ) THEN
    ALTER TABLE quiz_results ADD COLUMN love_situation_step_viewed boolean DEFAULT false;
  END IF;

  -- Palm reading results step (step 6)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_results' AND column_name = 'palm_reading_results_step_viewed'
  ) THEN
    ALTER TABLE quiz_results ADD COLUMN palm_reading_results_step_viewed boolean DEFAULT false;
  END IF;

  -- Loading revelation step (step 7)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_results' AND column_name = 'loading_revelation_step_viewed'
  ) THEN
    ALTER TABLE quiz_results ADD COLUMN loading_revelation_step_viewed boolean DEFAULT false;
  END IF;

  -- Paywall step (step 8)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_results' AND column_name = 'paywall_step_viewed'
  ) THEN
    ALTER TABLE quiz_results ADD COLUMN paywall_step_viewed boolean DEFAULT false;
  END IF;
END $$;

-- Create indexes for better query performance on the new columns
CREATE INDEX IF NOT EXISTS idx_quiz_results_video_step_viewed ON quiz_results (video_step_viewed);
CREATE INDEX IF NOT EXISTS idx_quiz_results_testimonials_step_viewed ON quiz_results (testimonials_step_viewed);
CREATE INDEX IF NOT EXISTS idx_quiz_results_name_collection_step_viewed ON quiz_results (name_collection_step_viewed);
CREATE INDEX IF NOT EXISTS idx_quiz_results_birth_data_collection_step_viewed ON quiz_results (birth_data_collection_step_viewed);
CREATE INDEX IF NOT EXISTS idx_quiz_results_love_situation_step_viewed ON quiz_results (love_situation_step_viewed);
CREATE INDEX IF NOT EXISTS idx_quiz_results_palm_reading_results_step_viewed ON quiz_results (palm_reading_results_step_viewed);
CREATE INDEX IF NOT EXISTS idx_quiz_results_loading_revelation_step_viewed ON quiz_results (loading_revelation_step_viewed);
CREATE INDEX IF NOT EXISTS idx_quiz_results_paywall_step_viewed ON quiz_results (paywall_step_viewed);