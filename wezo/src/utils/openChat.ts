import { router } from 'expo-router';

export function openChat(countryCode: string, number: string, name?: string) {
  router.push({ pathname: '/chat', params: { countryCode, number, name: name ?? '' } });
}
