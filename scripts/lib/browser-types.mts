export type BrowserTarget = { type: string; webSocketDebuggerUrl: string };
export type EvaluationResult<T> = { result: { value: T }; exceptionDetails?: unknown };
export type ProtocolMessage =
  | { id: number; error?: { message: string }; result: unknown }
  | { method: "Runtime.exceptionThrown"; params: { exceptionDetails: { text: string } } }
  | {
      method: "Runtime.consoleAPICalled";
      params: { type: string; args: Array<{ value?: unknown; description?: string }> };
    }
  | { method: "Fetch.requestPaused"; params: { requestId: string } };
export type Waiter = { resolve: (value: unknown) => void; reject: (error: Error) => void };
