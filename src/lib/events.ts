import { EventEmitter } from "events";

const globalForEvents = global as unknown as { gameEvents: EventEmitter };

if (!globalForEvents.gameEvents) {
  globalForEvents.gameEvents = new EventEmitter();
    // Set the maximum number of listeners
  globalForEvents.gameEvents.setMaxListeners(50);
}

export const gameEvents = globalForEvents.gameEvents;
