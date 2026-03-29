export type GameAction = 'ROCK' | 'PAPER' | 'SCISSORS';
export type GameResult = 'WIN' | 'LOSE' | 'DRAW';

export interface GamePlayResponse {
  botAction: GameAction;
  result: GameResult;
  nextYourScore: number;
  nextHighScore: number;
}