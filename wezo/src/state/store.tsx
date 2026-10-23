import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { defaultCountryCode } from '../data/countries';

export type Contact = {
  id: string;
  name: string;
  countryCode: string;
  number: string; // local digits, no calling code
};

export type CallRecord = {
  id: string;
  name?: string;
  countryCode: string;
  number: string;
  startedAt: number;
  durationSec: number;
  cost: number;
};

type PersistedState = {
  balance: number;
  countryCode: string;
  contacts: Contact[];
  recents: CallRecord[];
};

type Store = PersistedState & {
  ready: boolean;
  setCountry: (code: string) => void;
  addContact: (c: Omit<Contact, 'id'>) => void;
  removeContact: (id: string) => void;
  recordCall: (c: Omit<CallRecord, 'id'>) => void;
  clearRecents: () => void;
  topUp: (amount: number) => void;
};

const STORAGE_KEY = 'wezo-state-v1';

const initialState: PersistedState = {
  balance: 2, // welcome credit
  countryCode: defaultCountryCode,
  contacts: [],
  recents: [],
};

const StoreContext = createContext<Store | null>(null);

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setState({ ...initialState, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const setCountry = useCallback((countryCode: string) => setState((s) => ({ ...s, countryCode })), []);

  const addContact = useCallback(
    (c: Omit<Contact, 'id'>) =>
      setState((s) => ({
        ...s,
        contacts: [...s.contacts, { ...c, id: newId() }].sort((a, b) => a.name.localeCompare(b.name)),
      })),
    [],
  );

  const removeContact = useCallback(
    (id: string) => setState((s) => ({ ...s, contacts: s.contacts.filter((c) => c.id !== id) })),
    [],
  );

  const recordCall = useCallback(
    (c: Omit<CallRecord, 'id'>) =>
      setState((s) => ({
        ...s,
        balance: Math.max(0, +(s.balance - c.cost).toFixed(2)),
        recents: [{ ...c, id: newId() }, ...s.recents].slice(0, 100),
      })),
    [],
  );

  const clearRecents = useCallback(() => setState((s) => ({ ...s, recents: [] })), []);

  const topUp = useCallback(
    (amount: number) => setState((s) => ({ ...s, balance: +(s.balance + amount).toFixed(2) })),
    [],
  );

  const value = useMemo(
    () => ({ ...state, ready, setCountry, addContact, removeContact, recordCall, clearRecents, topUp }),
    [state, ready, setCountry, addContact, removeContact, recordCall, clearRecents, topUp],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside <StoreProvider>');
  return store;
}
