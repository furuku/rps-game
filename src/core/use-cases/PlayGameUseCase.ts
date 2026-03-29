import { GameAction, GamePlayResponse } from "../entities/game";
import { HighScoreRepository } from "../ports/HighScoreRepository";
import { GameLogic } from "../entities/GameLogic";
import { GameEventPublisher } from "../ports/GameEventPublisher";
import { GameEvent } from "../events/GameEvent";

export class PlayGameUseCase {
  constructor(
    private highScoreRepo: HighScoreRepository,
    private eventPublisher: GameEventPublisher,
  ) {}

  async execute(
    playerMove: GameAction,
    currentYourScore: number,
  ): Promise<GamePlayResponse> {
    // Bot action random
    const moves: GameAction[] = ["ROCK", "PAPER", "SCISSORS"];
    const botAction = moves[Math.floor(Math.random() * moves.length)];

    // Decide the result
    const result = GameLogic.judge(playerMove, botAction);

    // Calculate current score
    let nextYourScore = 0;
    if (result === "WIN") {
      nextYourScore = currentYourScore + 1;
    } else if (result === "DRAW") {
      nextYourScore = currentYourScore;
    }

    const currentHigh = await this.highScoreRepo.getHighScore();
    let nextHighScore = currentHigh;

    const now = new Date().toISOString();
    const events: GameEvent[] = [];

    events.push({
      type: "GAME_PLAYED",
      payload: {
        playerMove,
        botAction,
        result,
        timestamp: now,
      },
    });

    if (nextYourScore > currentHigh) {
      nextHighScore = nextYourScore;
      await this.highScoreRepo.saveHighScore(nextHighScore);

      events.push({
        type: "HIGH_SCORE_UPDATED",
        payload: {
          score: nextHighScore,
          timestamp: now,
        },
      });
    }

    // publish events
    for (const event of events) {
      try {
        await this.eventPublisher.publishGameEvent(event);
      } catch (err) {
        console.error("Event publish failed:", err);
      }
    }

    return {
      botAction,
      result,
      nextYourScore,
      nextHighScore,
    };
  }
}
