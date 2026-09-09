import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const DAILY_FREE_CREDITS = 100;

export interface CreditBalance {
  remaining: number;
  allowance: number;
}

/** Reads the balance, refreshing the daily allowance if it's a new UTC day. */
export const getCreditBalance = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ deviceId: z.string().min(8).max(64) }).parse(input),
  )
  .handler(async ({ data }): Promise<CreditBalance> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin.rpc("claim_credits", {
      _device_id: data.deviceId,
      _cost: 0,
    });
    if (error) return { remaining: DAILY_FREE_CREDITS, allowance: DAILY_FREE_CREDITS };
    const row = Array.isArray(rows) ? rows[0] : rows;
    return {
      remaining: row?.credits_remaining ?? DAILY_FREE_CREDITS,
      allowance: row?.daily_allowance ?? DAILY_FREE_CREDITS,
    };
  });
