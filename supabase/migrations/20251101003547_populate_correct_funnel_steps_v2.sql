/*
  # Populate correct funnel steps for all funnels

  This migration ensures all funnels have their correct steps loaded from the actual code.
*/

-- Temporarily disable the trigger
ALTER TABLE funnel_steps DISABLE TRIGGER funnel_step_change_logger;

DO $$
DECLARE
  funnel_1_id uuid;
  funnel_2_id uuid;
  funnel_3_id uuid;
  funnel_aff_id uuid;
  funnel_aff2_id uuid;
  funnel_esp_id uuid;
  funnel2_esp_id uuid;
BEGIN
  -- Get or create funnels
  SELECT id INTO funnel_1_id FROM funnels WHERE slug = 'funnel-1';
  IF funnel_1_id IS NULL THEN
    INSERT INTO funnels (name, slug, description, status, tags, config)
    VALUES ('Funnel 1', 'funnel-1', 'Quiz místico de leitura de palma', 'active', ARRAY['tarot', 'palm-reading']::text[], '{}')
    RETURNING id INTO funnel_1_id;
  END IF;

  SELECT id INTO funnel_2_id FROM funnels WHERE slug = 'funnel-2';
  IF funnel_2_id IS NULL THEN
    INSERT INTO funnels (name, slug, description, status, tags, config)
    VALUES ('Funnel 2', 'funnel-2', 'Quiz de desenho da alma gêmea', 'active', ARRAY['soulmate', 'astrology']::text[], '{}')
    RETURNING id INTO funnel_2_id;
  END IF;

  SELECT id INTO funnel_3_id FROM funnels WHERE slug = 'funnel-3';
  IF funnel_3_id IS NULL THEN
    INSERT INTO funnels (name, slug, description, status, tags, config)
    VALUES ('Funnel 3', 'funnel-3', 'Funnel 3', 'active', ARRAY[]::text[], '{}')
    RETURNING id INTO funnel_3_id;
  END IF;

  SELECT id INTO funnel_aff_id FROM funnels WHERE slug = 'funnel-aff';
  IF funnel_aff_id IS NULL THEN
    INSERT INTO funnels (name, slug, description, status, tags, config)
    VALUES ('Funnel Aff', 'funnel-aff', 'Funnel para afiliados', 'active', ARRAY['affiliate']::text[], '{}')
    RETURNING id INTO funnel_aff_id;
  END IF;

  SELECT id INTO funnel_aff2_id FROM funnels WHERE slug = 'funnel-aff2';
  IF funnel_aff2_id IS NULL THEN
    INSERT INTO funnels (name, slug, description, status, tags, config)
    VALUES ('Funnel Aff2', 'funnel-aff2', 'Funnel para afiliados v2', 'active', ARRAY['affiliate']::text[], '{}')
    RETURNING id INTO funnel_aff2_id;
  END IF;

  SELECT id INTO funnel_esp_id FROM funnels WHERE slug = 'funnel-esp';
  IF funnel_esp_id IS NULL THEN
    INSERT INTO funnels (name, slug, description, status, tags, config)
    VALUES ('Funnel ESP', 'funnel-esp', 'Funnel em espanhol', 'active', ARRAY['spanish']::text[], '{}')
    RETURNING id INTO funnel_esp_id;
  END IF;

  SELECT id INTO funnel2_esp_id FROM funnels WHERE slug = 'funnel2-esp';
  IF funnel2_esp_id IS NULL THEN
    INSERT INTO funnels (name, slug, description, status, tags, config)
    VALUES ('Funnel 2 ESP', 'funnel2-esp', 'Funnel 2 em espanhol', 'active', ARRAY['spanish']::text[], '{}')
    RETURNING id INTO funnel2_esp_id;
  END IF;

  -- Delete existing steps
  DELETE FROM funnel_steps WHERE funnel_id IN (funnel_1_id, funnel_2_id, funnel_3_id, funnel_aff_id, funnel_aff2_id, funnel_esp_id, funnel2_esp_id);

  -- Insert steps for funnel-1
  INSERT INTO funnel_steps (funnel_id, step_order, step_name, component_name, original_name, archived) VALUES
    (funnel_1_id, 1, 'Video Step', 'VideoStep', 'Video Step', false),
    (funnel_1_id, 2, 'Testimonials', 'TestimonialsCarousel', 'Testimonials', false),
    (funnel_1_id, 3, 'Name Collection', 'NameCollection', 'Name Collection', false),
    (funnel_1_id, 4, 'Birth Data Collection', 'BirthDataCollection', 'Birth Data Collection', false),
    (funnel_1_id, 5, 'Love Situation', 'LoveSituationStep', 'Love Situation', false),
    (funnel_1_id, 6, 'Palm Reading Results', 'PalmReadingResults', 'Palm Reading Results', false),
    (funnel_1_id, 7, 'Loading Revelation', 'LoadingRevelation', 'Loading Revelation', false),
    (funnel_1_id, 8, 'Paywall', 'PaywallStep', 'Paywall', false),
    (funnel_1_id, 9, 'Thank You', 'ThankYouStep', 'Thank You', false);

  -- Insert steps for funnel-2
  INSERT INTO funnel_steps (funnel_id, step_order, step_name, component_name, original_name, archived) VALUES
    (funnel_2_id, 1, 'Initiate Quiz', 'InitiateQuiz', 'Initiate Quiz', false),
    (funnel_2_id, 2, 'Testimonials', 'TestimonialsCarousel', 'Testimonials', false),
    (funnel_2_id, 3, 'Birth Date With Zodiac', 'BirthDateWithZodiac', 'Birth Date With Zodiac', false),
    (funnel_2_id, 4, 'Love Situation', 'LoveSituationStep', 'Love Situation', false),
    (funnel_2_id, 5, 'Ideal Partner Qualities', 'IdealPartnerQualities', 'Ideal Partner Qualities', false),
    (funnel_2_id, 6, 'Partner Preference', 'PartnerPreference', 'Partner Preference', false),
    (funnel_2_id, 7, 'Birth Chart Results', 'BirthChartResults', 'Birth Chart Results', false),
    (funnel_2_id, 8, 'Love Challenge', 'LoveChallenge', 'Love Challenge', false),
    (funnel_2_id, 9, 'Love Desire', 'LoveDesire', 'Love Desire', false),
    (funnel_2_id, 10, 'Soulmate Connection', 'SoulmateConnection', 'Soulmate Connection', false),
    (funnel_2_id, 11, 'Love Language', 'LoveLanguage', 'Love Language', false),
    (funnel_2_id, 12, 'Relationship Energy', 'RelationshipEnergy', 'Relationship Energy', false),
    (funnel_2_id, 13, 'Future Scenario', 'FutureScenario', 'Future Scenario', false),
    (funnel_2_id, 14, 'Social Proof', 'SocialProof', 'Social Proof', false),
    (funnel_2_id, 15, 'Soulmate Drawing Loading', 'SoulmateDrawingLoading', 'Soulmate Drawing Loading', false),
    (funnel_2_id, 16, 'Paywall', 'PaywallStep', 'Paywall', false),
    (funnel_2_id, 17, 'Thank You', 'ThankYouStep', 'Thank You', false);

  -- Insert steps for funnel-3
  INSERT INTO funnel_steps (funnel_id, step_order, step_name, component_name, original_name, archived) VALUES
    (funnel_3_id, 1, 'Video Step', 'VideoStep', 'Video Step', false),
    (funnel_3_id, 2, 'Testimonials', 'TestimonialsCarousel', 'Testimonials', false),
    (funnel_3_id, 3, 'Name Collection', 'NameCollection', 'Name Collection', false),
    (funnel_3_id, 4, 'Birth Data Collection', 'BirthDataCollection', 'Birth Data Collection', false),
    (funnel_3_id, 5, 'Love Situation', 'LoveSituationStep', 'Love Situation', false),
    (funnel_3_id, 6, 'Palm Reading Results', 'PalmReadingResults', 'Palm Reading Results', false),
    (funnel_3_id, 7, 'Loading Revelation', 'LoadingRevelation', 'Loading Revelation', false),
    (funnel_3_id, 8, 'Paywall', 'PaywallStep', 'Paywall', false),
    (funnel_3_id, 9, 'Thank You', 'ThankYouStep', 'Thank You', false);

  -- Insert steps for funnel-aff
  INSERT INTO funnel_steps (funnel_id, step_order, step_name, component_name, original_name, archived) VALUES
    (funnel_aff_id, 1, 'Video Step', 'VideoStep', 'Video Step', false),
    (funnel_aff_id, 2, 'Testimonials', 'TestimonialsCarousel', 'Testimonials', false),
    (funnel_aff_id, 3, 'Name Collection', 'NameCollection', 'Name Collection', false),
    (funnel_aff_id, 4, 'Birth Data Collection', 'BirthDataCollection', 'Birth Data Collection', false),
    (funnel_aff_id, 5, 'Love Situation', 'LoveSituationStep', 'Love Situation', false),
    (funnel_aff_id, 6, 'Palm Reading Results', 'PalmReadingResults', 'Palm Reading Results', false),
    (funnel_aff_id, 7, 'Loading Revelation', 'LoadingRevelation', 'Loading Revelation', false),
    (funnel_aff_id, 8, 'Paywall', 'PaywallStep', 'Paywall', false),
    (funnel_aff_id, 9, 'Thank You', 'ThankYouStep', 'Thank You', false);

  -- Insert steps for funnel-aff2
  INSERT INTO funnel_steps (funnel_id, step_order, step_name, component_name, original_name, archived) VALUES
    (funnel_aff2_id, 1, 'Initiate Quiz', 'InitiateQuiz', 'Initiate Quiz', false),
    (funnel_aff2_id, 2, 'Testimonials', 'TestimonialsCarousel', 'Testimonials', false),
    (funnel_aff2_id, 3, 'Birth Date With Zodiac', 'BirthDateWithZodiac', 'Birth Date With Zodiac', false),
    (funnel_aff2_id, 4, 'Love Situation', 'LoveSituationStep', 'Love Situation', false),
    (funnel_aff2_id, 5, 'Ideal Partner Qualities', 'IdealPartnerQualities', 'Ideal Partner Qualities', false),
    (funnel_aff2_id, 6, 'Partner Preference', 'PartnerPreference', 'Partner Preference', false),
    (funnel_aff2_id, 7, 'Birth Chart Results', 'BirthChartResults', 'Birth Chart Results', false),
    (funnel_aff2_id, 8, 'Love Challenge', 'LoveChallenge', 'Love Challenge', false),
    (funnel_aff2_id, 9, 'Love Desire', 'LoveDesire', 'Love Desire', false),
    (funnel_aff2_id, 10, 'Soulmate Connection', 'SoulmateConnection', 'Soulmate Connection', false),
    (funnel_aff2_id, 11, 'Love Language', 'LoveLanguage', 'Love Language', false),
    (funnel_aff2_id, 12, 'Relationship Energy', 'RelationshipEnergy', 'Relationship Energy', false),
    (funnel_aff2_id, 13, 'Future Scenario', 'FutureScenario', 'Future Scenario', false),
    (funnel_aff2_id, 14, 'Social Proof', 'SocialProof', 'Social Proof', false),
    (funnel_aff2_id, 15, 'Soulmate Drawing Loading', 'SoulmateDrawingLoading', 'Soulmate Drawing Loading', false),
    (funnel_aff2_id, 16, 'Paywall', 'PaywallStep', 'Paywall', false),
    (funnel_aff2_id, 17, 'Thank You', 'ThankYouStep', 'Thank You', false);

  -- Insert steps for funnel-esp
  INSERT INTO funnel_steps (funnel_id, step_order, step_name, component_name, original_name, archived) VALUES
    (funnel_esp_id, 1, 'Video Step', 'VideoStep', 'Video Step', false),
    (funnel_esp_id, 2, 'Testimonials', 'TestimonialsCarousel', 'Testimonials', false),
    (funnel_esp_id, 3, 'Name Collection', 'NameCollection', 'Name Collection', false),
    (funnel_esp_id, 4, 'Birth Data Collection', 'BirthDataCollection', 'Birth Data Collection', false),
    (funnel_esp_id, 5, 'Love Situation', 'LoveSituationStep', 'Love Situation', false),
    (funnel_esp_id, 6, 'Palm Reading Results', 'PalmReadingResults', 'Palm Reading Results', false),
    (funnel_esp_id, 7, 'Loading Revelation', 'LoadingRevelation', 'Loading Revelation', false),
    (funnel_esp_id, 8, 'Paywall', 'PaywallStep', 'Paywall', false),
    (funnel_esp_id, 9, 'Thank You', 'ThankYouStep', 'Thank You', false);

  -- Insert steps for funnel2-esp
  INSERT INTO funnel_steps (funnel_id, step_order, step_name, component_name, original_name, archived) VALUES
    (funnel2_esp_id, 1, 'Video Step', 'VideoStep', 'Video Step', false),
    (funnel2_esp_id, 2, 'Testimonials', 'TestimonialsCarousel', 'Testimonials', false),
    (funnel2_esp_id, 3, 'Name Collection', 'NameCollection', 'Name Collection', false),
    (funnel2_esp_id, 4, 'Birth Data Collection', 'BirthDataCollection', 'Birth Data Collection', false),
    (funnel2_esp_id, 5, 'Love Situation', 'LoveSituationStep', 'Love Situation', false),
    (funnel2_esp_id, 6, 'Palm Reading Results', 'PalmReadingResults', 'Palm Reading Results', false),
    (funnel2_esp_id, 7, 'Loading Revelation', 'LoadingRevelation', 'Loading Revelation', false),
    (funnel2_esp_id, 8, 'Paywall', 'PaywallStep', 'Paywall', false),
    (funnel2_esp_id, 9, 'Thank You', 'ThankYouStep', 'Thank You', false);

END $$;

-- Re-enable the trigger
ALTER TABLE funnel_steps ENABLE TRIGGER funnel_step_change_logger;