import { router } from 'expo-router';

export function placeCall(countryCode: string, number: string, name?: string) {
  router.push({ pathname: '/call', params: { countryCode, number, name: name ?? '' } });
}
