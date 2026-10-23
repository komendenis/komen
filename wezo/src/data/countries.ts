export type Country = {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  dial: string; // calling code without "+"
  rate: number; // USD per minute
};

export const countries: Country[] = [
  { code: 'US', name: 'United States', dial: '1', rate: 0.01 },
  { code: 'CA', name: 'Canada', dial: '1', rate: 0.01 },
  { code: 'MX', name: 'Mexico', dial: '52', rate: 0.03 },
  { code: 'CU', name: 'Cuba', dial: '53', rate: 0.69 },
  { code: 'DO', name: 'Dominican Republic', dial: '1809', rate: 0.12 },
  { code: 'HT', name: 'Haiti', dial: '509', rate: 0.29 },
  { code: 'JM', name: 'Jamaica', dial: '1876', rate: 0.15 },
  { code: 'CO', name: 'Colombia', dial: '57', rate: 0.04 },
  { code: 'BR', name: 'Brazil', dial: '55', rate: 0.05 },
  { code: 'GB', name: 'United Kingdom', dial: '44', rate: 0.02 },
  { code: 'DE', name: 'Germany', dial: '49', rate: 0.03 },
  { code: 'FR', name: 'France', dial: '33', rate: 0.03 },
  { code: 'ES', name: 'Spain', dial: '34', rate: 0.03 },
  { code: 'IT', name: 'Italy', dial: '39', rate: 0.03 },
  { code: 'SE', name: 'Sweden', dial: '46', rate: 0.02 },
  { code: 'PL', name: 'Poland', dial: '48', rate: 0.04 },
  { code: 'TR', name: 'Turkey', dial: '90', rate: 0.09 },
  { code: 'NG', name: 'Nigeria', dial: '234', rate: 0.09 },
  { code: 'GH', name: 'Ghana', dial: '233', rate: 0.15 },
  { code: 'KE', name: 'Kenya', dial: '254', rate: 0.08 },
  { code: 'UG', name: 'Uganda', dial: '256', rate: 0.14 },
  { code: 'TZ', name: 'Tanzania', dial: '255', rate: 0.16 },
  { code: 'ET', name: 'Ethiopia', dial: '251', rate: 0.22 },
  { code: 'CM', name: 'Cameroon', dial: '237', rate: 0.25 },
  { code: 'SN', name: 'Senegal', dial: '221', rate: 0.24 },
  { code: 'ZA', name: 'South Africa', dial: '27', rate: 0.07 },
  { code: 'EG', name: 'Egypt', dial: '20', rate: 0.11 },
  { code: 'MA', name: 'Morocco', dial: '212', rate: 0.19 },
  { code: 'IN', name: 'India', dial: '91', rate: 0.02 },
  { code: 'PK', name: 'Pakistan', dial: '92', rate: 0.08 },
  { code: 'BD', name: 'Bangladesh', dial: '880', rate: 0.04 },
  { code: 'PH', name: 'Philippines', dial: '63', rate: 0.12 },
  { code: 'VN', name: 'Vietnam', dial: '84', rate: 0.07 },
  { code: 'CN', name: 'China', dial: '86', rate: 0.02 },
  { code: 'AE', name: 'United Arab Emirates', dial: '971', rate: 0.14 },
  { code: 'SA', name: 'Saudi Arabia', dial: '966', rate: 0.12 },
  { code: 'AU', name: 'Australia', dial: '61', rate: 0.03 },
];

export const defaultCountryCode = 'NG';

export function findCountry(code: string): Country {
  return countries.find((c) => c.code === code) ?? countries[0];
}

/** Turns "NG" into the 🇳🇬 emoji using regional indicator symbols. */
export function flagOf(code: string): string {
  return String.fromCodePoint(...[...code.toUpperCase()].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));
}

/** Price of one outgoing SMS (USD). Placeholder pricing until rates come from the backend. */
export function smsRateOf(country: Country): number {
  return Math.max(0.03, +(country.rate * 0.75).toFixed(2));
}
