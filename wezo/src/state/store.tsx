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

export type Profile = {
  name: string;
  email: string;
  phone: string; // the user's own number, as typed
  accessPoint: string; // id from src/data/accessPoints.ts
};

export type Settings = {
  notifyCalls: boolean;
  notifyMessages: boolean;
  notifyAccount: boolean; // low balance, top-up receipts
  notifyOffers: boolean;
  lowBalanceAlert: boolean;
  autoTopUp: boolean;
  autoTopUpAmount: number;
};

export type PaymentMethod = 'card' | 'mpesa' | 'paypal' | 'auto' | 'invite';

export type Payment = {
  id: string;
  amount: number;
  method: PaymentMethod;
  at: number;
};

/** Auto top-up kicks in when a call or text leaves the balance below this. */
export const AUTO_TOPUP_THRESHOLD = 1;
export const INVITE_BONUS = 1;

type PersistedState = {
  balance: number;
  countryCode: string;
  contacts: Contact[];
  recents: CallRecord[];
  threads: Thread[];
  profile: Profile;
  settings: Settings;
  payments: Payment[]; // newest first
  inviteCode: string;
  inviteRedeemed: boolean;
  signedIn: boolean;
};

type OutgoingMessage = { countryCode: string; number: string; name?: string; text: string; cost: number };

type Store = PersistedState & {
  ready: boolean;
  setCountry: (code: string) => void;
  addContact: (c: Omit<Contact, 'id'>) => void;
  removeContact: (id: string) => void;
  recordCall: (c: Omit<CallRecord, 'id'>) => void;
  clearRecents: () => void;
  topUp: (amount: number, method: PaymentMethod) => void;
  updateProfile: (p: Partial<Profile>) => void;
  updateSettings: (p: Partial<Settings>) => void;
  redeemInvite: (code: string) => string | null; // error message, or null on success
  resetAll: () => void;
  signIn: (name: string, phone: string) => void;
  signOut: () => void;
  addMessage: (m: OutgoingMessage) => { threadId: string; messageId: string };
  setMessageStatus: (threadId: string, messageId: string, status: MessageStatus) => void;
  deleteThread: (threadId: string) => void;
};

export const threadIdOf = (countryCode: string, number: string) => `${countryCode}:${number}`;

const STORAGE_KEY = 'wezo-state-v1';

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const newInviteCode = () => `WEZO-${Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, '7')}`;

const makeInitialState = (): PersistedState => ({
  balance: 2, // welcome credit
  countryCode: defaultCountryCode,
  contacts: [],
  recents: [],
  threads: [],
  profile: { name: '', email: '', phone: '', accessPoint: 'auto' },
  settings: {
    notifyCalls: true,
    notifyMessages: true,
    notifyAccount: true,
    notifyOffers: false,
    lowBalanceAlert: true,
    autoTopUp: false,
    autoTopUpAmount: 10,
  },
  payments: [],
  inviteCode: newInviteCode(),
  inviteRedeemed: false,
  signedIn: false,
});

const initialState = makeInitialState();

const StoreContext = createContext<Store | null>(null);

const credit = (s: PersistedState, amount: number, method: PaymentMethod): PersistedState => ({
  ...s,
  balance: +(s.balance + amount).toFixed(2),
  payments: [{ id: newId(), amount, method, at: Date.now() }, ...s.payments].slice(0, 200),
});

/** Charges the balance and runs auto top-up if it is on and the balance is now low. */
const charge = (s: PersistedState, amount: number): PersistedState => {
  const next = { ...s, balance: Math.max(0, +(s.balance - amount).toFixed(2)) };
  return next.settings.autoTopUp && next.balance < AUTO_TOPUP_THRESHOLD
    ? credit(next, next.settings.autoTopUpAmount, 'auto')
    : next;
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw);
        setState({
          ...initialState,
          ...saved,
          profile: { ...initialState.profile, ...saved.profile },
          settings: { ...initialState.settings, ...saved.settings },
          signedIn: saved.signedIn ?? true, // data saved before sign-in existed belongs to a signed-in user
        });
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
      setState((s) => charge({ ...s, recents: [{ ...c, id: newId() }, ...s.recents].slice(0, 100) }, c.cost)),
    [],
  );

  const clearRecents = useCallback(() => setState((s) => ({ ...s, recents: [] })), []);

  const topUp = useCallback(
    (amount: number, method: PaymentMethod) => setState((s) => credit(s, amount, method)),
    [],
  );

  const updateProfile = useCallback(
    (p: Partial<Profile>) => setState((s) => ({ ...s, profile: { ...s.profile, ...p } })),
    [],
  );

  const updateSettings = useCallback(
    (p: Partial<Settings>) => setState((s) => ({ ...s, settings: { ...s.settings, ...p } })),
    [],
  );

  // Demo rules only: a real backend must check that the code belongs to another user.
  const redeemInvite = useCallback(
    (raw: string) => {
      const code = raw.trim().toUpperCase();
      if (state.inviteRedeemed) return 'You have already used an invite code.';
      if (!/^WEZO-[A-Z0-9]{4}$/.test(code)) return 'Invite codes look like WEZO-AB12.';
      if (code === state.inviteCode) return 'That is your own code. Share it with friends instead.';
      setState((s) => ({ ...credit(s, INVITE_BONUS, 'invite'), inviteRedeemed: true }));
      return null;
    },
    [state.inviteRedeemed, state.inviteCode],
  );

  const resetAll = useCallback(() => setState(makeInitialState()), []);

  // Demo sign-in: no SMS verification yet. A real backend must verify the phone number.
  const signIn = useCallback(
    (name: string, phone: string) =>
      setState((s) => ({ ...s, signedIn: true, profile: { ...s.profile, name, phone } })),
    [],
  );

  // Keeps calls, messages and contacts on the phone so they are back after signing in again.
  const signOut = useCallback(() => setState((s) => ({ ...s, signedIn: false })), []);

  const addMessage = useCallback((m: OutgoingMessage) => {
    const threadId = threadIdOf(m.countryCode, m.number);
    const message: Message = { id: newId(), text: m.text, sentAt: Date.now(), status: 'sending', cost: m.cost };
    setState((s) => {
      const existing = s.threads.find((t) => t.id === threadId);
      const thread: Thread = existing
        ? { ...existing, name: m.name || existing.name, messages: [...existing.messages, message], updatedAt: message.sentAt }
        : { id: threadId, countryCode: m.countryCode, number: m.number, name: m.name, messages: [message], updatedAt: message.sentAt };
      return charge({ ...s, threads: [thread, ...s.threads.filter((t) => t.id !== threadId)] }, m.cost);
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
      updateProfile,
      updateSettings,
      redeemInvite,
      resetAll,
      signIn,
      signOut,
    }),
    [
      state,
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
      updateProfile,
      updateSettings,
      redeemInvite,
      resetAll,
      signIn,
      signOut,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside <StoreProvider>');
  return store;
}
