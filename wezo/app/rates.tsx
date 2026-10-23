import { router } from 'expo-router';
import { CountryList } from '../src/components/CountryList';
import { useStore } from '../src/state/store';

export default function RatesScreen() {
  const { countryCode, setCountry } = useStore();
  return (
    <CountryList
      selected={countryCode}
      onSelect={(c) => {
        setCountry(c.code);
        router.navigate('/');
      }}
    />
  );
}
