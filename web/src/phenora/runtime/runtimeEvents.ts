import { RuntimeEvent, RuntimeEventType } from "../types";

export type RuntimeEventListener = (event: RuntimeEvent) => void;

class EventEmitter {
  private listeners: Set<RuntimeEventListener> = new Set();

  public subscribe(listener: RuntimeEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public emit(event: RuntimeEvent) {
    this.listeners.forEach(listener => listener(event));
  }
}

export const runtimeEventEmitter = new EventEmitter();
