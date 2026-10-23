import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { defaultCountryCode } from '../data/countries';
import type { MessageStatus } from '../services/messageService';

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

export type Message = {
  id: string;
  text: string;
  sentAt: number;
  status: MessageStatus;
  cost: number;
};

export type Thread = {
  id: string; // `${countryCode}:${number}`
  countryCode: string;
  number: string;
  name?: string;
  messages: Message[]; // oldest first
  updatedAt: number;
};

type PersistedState = {
  balance: number;
  countryCode: string;
  contacts: Contact[];
  recents: CallRecord[];
  threads: Thread[];
};

type OutgoingMessage = { countryCode: string; number: string; name?: string; text: string; cost: number };

type Store = PersistedState & {
  ready: boolean;
  setCountry: (code: string) => void;
  addContact: (c: Omit<Contact, 'id'>) => void;
  removeContact: (id: string) => void;
  recordCall: (c: Omit<CallRecord, 'id'>) => void;
  clearRecents: () => void;
  topUp: (amount: number) => void;
  addMessage: (m: OutgoingMessage) => { threadId: string; messageId: string };
  setMessageStatus: (threadId: string, messageId: string, status: MessageStatus) => void;
  deleteThread: (threadId: string) => void;
};

export const threadIdOf = (countryCode: string, number: string) => `${countryCode}:${number}`;

const STORAGE_KEY = 'wezo-state-v1';

const initialState: PersistedState = {
  balance: 2, // welcome credit
  countryCode: defaultCountryCode,
  contacts: [],
  recents: [],
  threads: [],
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

  const addMessage = useCallback((m: OutgoingMessage) => {
    const threadId = threadIdOf(m.countryCode, m.number);
    const message: Message = { id: newId(), text: m.text, sentAt: Date.now(), status: 'sending', cost: m.cost };
    setState((s) => {
      const existing = s.threads.find((t) => t.id === threadId);
      const thread: Thread = existing
        ? { ...existing, name: m.name || existing.name, messages: [...existing.messages, message], updatedAt: message.sentAt }
        : { id: threadId, countryCode: m.countryCode, number: m.number, name: m.name, messages: [message], updatedAt: message.sentAt };
      return {
        ...s,
        balance: Math.max(0, +(s.balance - m.cost).toFixed(2)),
        threads: [thread, ...s.threads.filter((t) => t.id !== threadId)],
      };
    });
    return { threadId, messageId: message.id };
  }, []);

  const setMessageStatus = useCallback(
    (threadId: string, messageId: string, status: MessageStatus) =>
      setState((s) => ({
        ...s,
        threads: s.threads.map((t) =>
          t.id !== threadId
            ? t
            : { ...t, messages: t.messages.map((msg) => (msg.id === messageId ? { ...msg, status } : msg)) },
        ),
      })),
    [],
  );

  const deleteThread = useCallback(
    (threadId: string) => setState((s) => ({ ...s, threads: s.threads.filter((t) => t.id !== threadId) })),
    [],
  );

  const value = useMemo(
    () => ({
      ...state,
      ready,
      setCountry,
      addContact,
      removeContact,
      recordCall,
      clearRecents,
      topUp,
      addMessage,
      setMessageStatus,
      deleteThread,
    }),
    [state, ready, setCountry, addContact, removeContact, recordCall, clearRecents, topUp, addMessage, setMessageStatus, deleteThread],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside <StoreProvider>');
  return store;
}
