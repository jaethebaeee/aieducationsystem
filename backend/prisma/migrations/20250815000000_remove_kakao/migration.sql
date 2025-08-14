-- Remove Kakao-related columns and constraints
-- Safe for Postgres; adjust if using another DB

ALTER TABLE "subscriptions" DROP COLUMN IF EXISTS "kakaoPaySubscriptionId";

-- If any rows in payment_orders used KAKAO, keep values but update comment expectations only.
-- No schema change to payment_orders required beyond documentation.
