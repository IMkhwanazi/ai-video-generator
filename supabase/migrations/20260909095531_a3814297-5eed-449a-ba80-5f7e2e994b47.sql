CREATE TABLE public.credit_wallets (
  device_id text PRIMARY KEY,
  credits_remaining integer NOT NULL DEFAULT 100,
  period_date date NOT NULL DEFAULT ((now() AT TIME ZONE 'utc')::date),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.credit_wallets TO service_role;

ALTER TABLE public.credit_wallets ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_credit_wallets_updated_at
BEFORE UPDATE ON public.credit_wallets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.claim_credits(_device_id text, _cost integer)
RETURNS TABLE(allowed boolean, credits_remaining integer, daily_allowance integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _today date := (now() AT TIME ZONE 'utc')::date;
  _allowance integer := 100;
  _balance integer;
BEGIN
  INSERT INTO public.credit_wallets (device_id, credits_remaining, period_date)
  VALUES (_device_id, _allowance, _today)
  ON CONFLICT (device_id) DO NOTHING;

  UPDATE public.credit_wallets w
  SET credits_remaining = _allowance, period_date = _today
  WHERE w.device_id = _device_id AND w.period_date < _today;

  SELECT w.credits_remaining INTO _balance
  FROM public.credit_wallets w
  WHERE w.device_id = _device_id
  FOR UPDATE;

  IF _cost > 0 AND _balance >= _cost THEN
    UPDATE public.credit_wallets w
    SET credits_remaining = w.credits_remaining - _cost
    WHERE w.device_id = _device_id
    RETURNING w.credits_remaining INTO _balance;
    RETURN QUERY SELECT true, _balance, _allowance;
  ELSIF _cost <= 0 THEN
    RETURN QUERY SELECT true, _balance, _allowance;
  ELSE
    RETURN QUERY SELECT false, _balance, _allowance;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.refund_credits(_device_id text, _amount integer)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.credit_wallets
  SET credits_remaining = LEAST(100, credits_remaining + GREATEST(_amount, 0))
  WHERE device_id = _device_id;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_credits(text, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.refund_credits(text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_credits(text, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.refund_credits(text, integer) TO service_role;