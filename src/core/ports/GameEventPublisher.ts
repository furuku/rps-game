import { GameEvent } from "../events/GameEvent";

export interface GameEventPublisher {
  publishGameEvent(event: GameEvent): Promise<void>;
}