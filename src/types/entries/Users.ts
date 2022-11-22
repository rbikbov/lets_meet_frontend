type NumericBoolean = 0 | 1;

export interface UserEntry {
  id: string;
  email: string;
  name: string;
  deposit_enabled: NumericBoolean;
  withdrawal_enabled: NumericBoolean;
  trading_enabled: NumericBoolean;
}
