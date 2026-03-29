export type GameEvent =
  | {
      type: "GAME_PLAYED";
      payload: {
        playerMove: "ROCK" | "PAPER" | "SCISSORS";
        botAction: "ROCK" | "PAPER" | "SCISSORS";
        result: "WIN" | "LOSE" | "DRAW";
        timestamp: string;
      };
    }
  | {
      type: "HIGH_SCORE_UPDATED";
      payload: {
        score: number;
        timestamp: string;
      };
    };