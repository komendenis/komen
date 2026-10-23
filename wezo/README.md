# WEZO

International calling app (in the spirit of Rebtel), built with React Native + Expo Router.

## Features

- **Keypad**: pick a destination country (flag, calling code, per-minute rate) and dial.
- **Contacts**: save the people you call abroad; tap to call, long-press to delete.
- **Recents**: call history with duration and cost; tap to call back.
- **Rates**: searchable list of per-minute rates for 37 countries.
- **Account**: credit balance and top-ups ($2 welcome credit).
- **In-call screen**: ringing → connected timer, live cost, mute, speaker, DTMF keypad, hang up.
  Calls are billed per started minute and end automatically when credit runs out.

Data (balance, contacts, recents, selected country) is stored on the device with AsyncStorage.

## Run it

```bash
cd wezo
npm install
npx expo install --fix   # aligns package versions with the installed Expo SDK
npx expo start
```

Scan the QR code with **Expo Go** (Android/iOS), or press `w` to open it in a browser.

## Demo mode

Out of the box, calling and payments are **simulated**: `src/services/callService.ts` ships a
`demoProvider` that fakes ringing and answering, and top-ups add free credit. No real call is placed
and no money is charged.

## Going live

1. **Calls**: implement `CallProvider` in `src/services/callService.ts` with a VoIP SDK
   (e.g. Twilio Voice React Native SDK, Vonage, Plivo or Telnyx) and set `callProvider` to it.
   Native VoIP SDKs need a development build (`npx expo prebuild` / EAS Build), not Expo Go.
2. **Backend**: a small server that issues VoIP access tokens, holds user balances, and
   charges calls from the provider's call-completed webhooks (never trust the client for billing).
3. **Payments**: in-app purchases or Stripe for top-ups.
4. **Auth**: phone number sign-up with SMS verification.
5. **Rates**: load rates from the backend instead of `src/data/countries.ts`.

## Structure

```
app/                 Expo Router screens
  (tabs)/            Keypad, Contacts, Recents, Rates, Account
  call.tsx           In-call screen
  countries.tsx      Country picker modal
src/
  components/        Keypad, CountryButton, CountryList
  data/countries.ts  Countries, calling codes, rates
  services/          Calling provider interface + demo provider
  state/store.tsx    App state + persistence
  utils/             Formatting and billing helpers
```
