import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PlayGameUseCase } from '@/core/use-cases/PlayGameUseCase';
import { PrismaHighScoreAdapter } from '@/adapters/persistence/PrismaHighScoreAdapter';
import { GameAction } from '@/core/entities/game';
import { gameEvents } from '@/lib/events';
import { RabbitMQPublisher } from '@/adapters/messaging/RabbitMQPublisher';

export async function POST(req: NextRequest) {
  try {
    const { playerAction } = await req.json() as { playerAction: GameAction };
    const cookieStore = await cookies();
    
    // Get current score from cookie
    const currentYourScore = parseInt(cookieStore.get('your-score')?.value || '0');

    // Dependency Injection
    const highScoreRepo = new PrismaHighScoreAdapter();
    const eventPublisher = new RabbitMQPublisher();
    const playGame = new PlayGameUseCase(highScoreRepo, eventPublisher);

    // Run use case
    const result = await playGame.execute(playerAction, currentYourScore);
    gameEvents.emit('highScoreUpdate', result.nextHighScore);

    // Update score to cookie
    const response = NextResponse.json(result);
    response.cookies.set('your-score', result.nextYourScore.toString(), { 
      httpOnly: true,
      path: '/'
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}