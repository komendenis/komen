/**
 * Messaging layer. Screens only talk to `MessageProvider`, so a real SMS API
 * (Twilio Messaging, Vonage, Plivo, Telnyx...) can be dropped in later.
 *
 * The bundled `demoMessageProvider` simulates sending and delivery. It does NOT send a real SMS.
 */

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'failed';

export interface MessageProvider {
  readonly isDemo: boolean;
  send(toE164: string, text: string, onStatus: (status: MessageStatus) => void): void;
}

export const demoMessageProvider: MessageProvider = {
  isDemo: true,
  send(_to, _text, onStatus) {
    setTimeout(() => onStatus('sent'), 400);
    setTimeout(() => onStatus('delivered'), 1500);
  },
};

export const messageProvider: MessageProvider = demoMessageProvider;
