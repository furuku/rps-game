export interface HighScoreRepository {
  getHighScore(): Promise<number>;
  saveHighScore(score: number): Promise<void>;
}