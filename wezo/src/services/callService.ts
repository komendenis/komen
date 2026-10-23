/**
 * Calling layer. The UI only talks to `CallProvider`, so a real VoIP backend
 * (Twilio Voice, Vonage, Plivo, Telnyx...) can be dropped in without touching screens.
 *
 * The bundled `demoProvider` simulates a call (ringing -> connected) so the app
 * can be tried in Expo Go. It does NOT place a real phone call.
 */

export type CallEndReason = 'hangup' | 'remote' | 'failed' | 'no-credit';

export type CallHandlers = {
  onRinging?: () => void;
  onConnected?: () => void;
  onEnded?: (reason: CallEndReason) => void;
};

export interface CallSession {
  hangup(reason?: CallEndReason): void;
  setMuted(muted: boolean): void;
  setSpeaker(on: boolean): void;
  sendDigits(digits: string): void;
}

export interface CallProvider {
  readonly name: string;
  readonly isDemo: boolean;
  startCall(toE164: string, handlers: CallHandlers): CallSession;
}

export const demoProvider: CallProvider = {
  name: 'Demo',
  isDemo: true,
  startCall(_to, handlers) {
    let ended = false;
    const ring = setTimeout(() => !ended && handlers.onRinging?.(), 300);
    const answer = setTimeout(() => !ended && handlers.onConnected?.(), 2500);

    return {
      hangup(reason = 'hangup') {
        if (ended) return;
        ended = true;
        clearTimeout(ring);
        clearTimeout(answer);
        handlers.onEnded?.(reason);
      },
      setMuted() {},
      setSpeaker() {},
      sendDigits() {},
    };
  },
};

export const callProvider: CallProvider = demoProvider;
