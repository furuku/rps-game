import { GameAction, GameResult } from './game';

export class GameLogic {
  static judge(player: GameAction, bot: GameAction): GameResult {
    if (player === bot) return 'DRAW';
    if (
      (player === 'ROCK' && bot === 'SCISSORS') ||
      (player === 'PAPER' && bot === 'ROCK') ||
      (player === 'SCISSORS' && bot === 'PAPER')
    ) return 'WIN';
    return 'LOSE';
  }
}