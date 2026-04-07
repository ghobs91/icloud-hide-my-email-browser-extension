import browser from 'webextension-polyfill';

export enum MessageType {
  Autofill,
  GenerateRequest,
  GenerateResponse,
  ReservationRequest,
  ReservationResponse,
  ActiveInputElementWrite,
}

export type Message<T> = {
  type: MessageType;
  data: T;
};

export type ReservationRequestData = {
  hme: string;
  label: string;
  elementId: string;
};

export type GenerationResponseData = {
  hme?: string;
  elementId: string;
  error?: string;
};

export type ActiveInputElementWriteData = {
  text: string;
  copyToClipboard: boolean;
};

export type ReservationResponseData = GenerationResponseData;

export function isValidMessage(value: unknown): value is Message<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    typeof (value as Record<string, unknown>).type === 'number' &&
    Object.values(MessageType).includes(
      (value as Record<string, unknown>).type as MessageType
    ) &&
    'data' in value
  );
}

export const sendMessageToTab = async (
  type: MessageType,
  data: unknown,
  tab?: browser.Tabs.Tab
): Promise<void> => {
  if (tab === undefined) {
    [tab] = await browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
  }

  if (tab?.id !== undefined) {
    await browser.tabs.sendMessage(tab.id, {
      type,
      data,
    });
  }
};
