import { prisma } from '@/lib/prisma';
import { HighScoreRepository } from '@/core/ports/HighScoreRepository';

export class PrismaHighScoreAdapter implements HighScoreRepository {
  async getHighScore(): Promise<number> {
    const record = await prisma.highScore.findUnique({
      where: { id: 1 },
    });
    return record?.score ?? 0;
  }

  async saveHighScore(score: number): Promise<void> {
    await prisma.highScore.upsert({
      where: { id: 1 },
      update: { score: score },
      create: { id: 1, score: score },
    });
  }
}