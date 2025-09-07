export type Option<T = number, U = string> = {
  value: T;
  label: U;
  color?: string;
  icon?: string;
  info?: string;
};
