UPDATE "items"
SET "metadata" = ("metadata" - 'play' - 'view')
  || CASE
    WHEN "metadata" ? 'play' AND NOT ("metadata" ? 'plays')
    THEN jsonb_build_object('plays', "metadata"->'play')
    ELSE '{}'::jsonb
  END
  || CASE
    WHEN "metadata" ? 'view' AND NOT ("metadata" ? 'views')
    THEN jsonb_build_object('views', "metadata"->'view')
    ELSE '{}'::jsonb
  END
WHERE "platform" = 'instagram'
  AND "kind" = 'post'
  AND ("metadata" ? 'play' OR "metadata" ? 'view');
