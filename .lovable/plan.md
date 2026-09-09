# Daily 100 free credits

Right now the studio only *estimates* a credit cost — nothing is tracked or spent. This adds a real daily allowance of 100 free credits per person, refreshed automatically every day.

## How it works for the user

- Each visitor (identified by the same anonymous device ID already used for their projects) starts each day with 100 credits.
- The credit balance is shown in the studio header and refreshes after each video.
- Before generating, the studio shows the cost and whether it fits in the remaining balance.
- If a video costs more than what is left, the Generate button is blocked with a friendly message: "You have X credits left today. Your 100 free credits reset at midnight UTC — try a shorter video or a lower resolution."
- If a generation fails to start, the credits are not taken.
- A small line under the balance says when the next refill happens.

## Backend

New table `public.credit_wallets`:

- `device_id text primary key`
- `credits_remaining integer not null default 100`
- `period_date date not null default (now() at time zone 'utc')::date`
- `updated_at timestamptz`

Grants: `service_role` full access only (all reads/writes go through server functions); no anon/authenticated grants, RLS enabled with no public policies.

A Postgres function `public.claim_credits(_device_id text, _cost integer)` runs as security definer and does the whole thing atomically:
1. Insert the wallet row if missing.
2. If `period_date` is older than today (UTC), reset `credits_remaining` to 100 and set `period_date` to today.
3. If `credits_remaining >= _cost`, subtract and return the new balance with `allowed = true`; otherwise return `allowed = false` and the current balance.

No cron job is needed — the reset happens lazily the first time someone is seen on a new day, so there is no recurring background cost.

## App changes

- `src/lib/credits.functions.ts`: `getCreditBalance({ deviceId })` (reads/refreshes without spending) and internal use of the claim function.
- `src/lib/video.functions.ts`: in `createGeneration`, compute the cost with the existing `estimateCredits`, call `claim_credits` before contacting the video provider, and refund (add the cost back) if the provider call throws so a failed start costs nothing.
- `src/routes/studio.tsx`: fetch the balance on load and after each generation, show "X / 100 free credits today" in the header, disable Generate when the estimate exceeds the balance, and surface the plain-language out-of-credits message.
- `src/routes/pricing.tsx`: change the Free tier line from "100 credits / month" to "100 free credits every day".

## Not included

Paid tiers, purchases and accounts stay as they are — this only covers the free daily allowance.
