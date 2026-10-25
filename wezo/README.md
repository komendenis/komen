# WEZO

International calling app (in the spirit of Rebtel), built with React Native + Expo Router.

## Features

- **Keypad**: pick a destination country (flag, calling code, per-minute rate) and dial.
- **Contacts**: save the people you call abroad; tap to call, long-press to delete.
- **Recents**: call history with duration and cost; tap to call back.
- **Messages**: text anyone abroad; conversations list, chat screen with sent/delivered status,
  per-message price and a 160-character limit. Start a chat from Messages or from a contact.
- **Account**: credit balance, top-ups ($2 welcome credit) and calling rates for 37 countries.
- **In-call screen**: ringing → connected timer, live cost, mute, speaker, DTMF keypad, hang up.
  Calls are billed per started minute and end automatically when credit runs out.

Branding: pink-red WEZO logo (a "W" with signal waves) in `assets/`: `logo.svg` is the source, with the
app icon, Android adaptive icon and favicon rendered from it.

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

Out of the box, calling, messaging and payments are **simulated**: `src/services/callService.ts`
ships a `demoProvider` that fakes ringing and answering, `src/services/messageService.ts` fakes SMS
sending and delivery, and top-ups add free credit. No real call or SMS is sent and no money is charged.

## Going live

1. **Calls**: implement `CallProvider` in `src/services/callService.ts` with a VoIP SDK
   (e.g. Twilio Voice React Native SDK, Vonage, Plivo or Telnyx) and set `callProvider` to it.
   Native VoIP SDKs need a development build (`npx expo prebuild` / EAS Build), not Expo Go.
2. **Messages**: implement `MessageProvider` in `src/services/messageService.ts` with an SMS API
   (e.g. Twilio Messaging), sent from your backend so API keys never ship in the app. Incoming
   replies need the backend plus push notifications.
3. **Backend**: a small server that issues VoIP access tokens, holds user balances, and
   charges calls from the provider's call-completed webhooks (never trust the client for billing).
4. **Payments**: in-app purchases or Stripe for top-ups.
5. **Auth**: phone number sign-up with SMS verification.
6. **Rates**: load rates from the backend instead of `src/data/countries.ts`.

## Structure

```
app/                 Expo Router screens
  (tabs)/            Keypad, Contacts, Messages, Recents, Account
  call.tsx           In-call screen
  chat.tsx           Conversation screen
  rates.tsx          Calling rates
  countries.tsx      Country picker modal
assets/              Logo (SVG source) and app icons
src/
  components/        Keypad, CountryButton, CountryList
  data/countries.ts  Countries, calling codes, rates
  services/          Calling and messaging providers + demo versions
  state/store.tsx    App state + persistence
  utils/             Formatting and billing helpers
```
