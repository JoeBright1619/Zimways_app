export type LocationProps = {
  id?: string;
  label: string | null;
  sector?: string;
  district?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  default?: boolean;
  fullAddress?: string;
};
