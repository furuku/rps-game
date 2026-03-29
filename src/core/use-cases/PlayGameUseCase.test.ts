import { PlayGameUseCase } from "./PlayGameUseCase";
import { HighScoreRepository } from "../ports/HighScoreRepository";
import { GameEventPublisher } from "../ports/GameEventPublisher";

// Mock Repository
class MockHighScoreRepo implements HighScoreRepository {
  public dbScore = 5;
  async getHighScore(): Promise<number> {
    return this.dbScore;
  }
  async saveHighScore(score: number): Promise<void> {
    this.dbScore = score;
  }
}

// Mock Publisher
class MockGameEventPublisher implements GameEventPublisher {
  publishGameEvent = jest.fn().mockResolvedValue(undefined);
}

describe("PlayGameUseCase", () => {
  let mockRepo: MockHighScoreRepo;
  let mockPublisher: MockGameEventPublisher;
  let useCase: PlayGameUseCase;

  beforeEach(() => {
    mockRepo = new MockHighScoreRepo();
    mockPublisher = new MockGameEventPublisher();

    useCase = new PlayGameUseCase(mockRepo, mockPublisher);

    // Force the bot to choose SCISSORS
    jest.spyOn(Math, "random").mockReturnValue(0.99);
  });

  afterEach(() => {
    jest.spyOn(Math, "random").mockRestore();
    jest.clearAllMocks();
  });

  it('should save new score and emit event when achieving a high score', async () => {
    const currentYourScore = 5;
    const result = await useCase.execute("ROCK", currentYourScore); // ชนะ ได้ 6 แต้ม

    // check nextHighScore
    expect(result.nextHighScore).toBe(6);

    // Check that a high score event was published
    const highScoreEvents = mockPublisher.publishGameEvent.mock.calls.filter(
      (call) =>
        call[0].payload?.score && call[0].payload.score > mockRepo.dbScore - 1,
    );
    expect(highScoreEvents.length).toBe(1);
    expect(highScoreEvents[0][0]).toEqual(
      expect.objectContaining({
        payload: expect.objectContaining({ score: 6 }),
      }),
    );
  });

  it("should not emit event if a new High Score is not achieved", async () => {
    const currentYourScore = 3;
    mockRepo.dbScore = 10;

    await useCase.execute("SCISSORS", currentYourScore);

    // Check that no high score event was published
    const highScoreEvents = mockPublisher.publishGameEvent.mock.calls.filter(
      (call) =>
        call[0].payload?.score && call[0].payload.score > mockRepo.dbScore,
    );
    expect(highScoreEvents.length).toBe(0);

    // Check that at least one GAME_PLAYED event was published
    const gamePlayedEvents = mockPublisher.publishGameEvent.mock.calls.filter(
      (call) => call[0].type === "GAME_PLAYED",
    );
    expect(gamePlayedEvents.length).toBeGreaterThanOrEqual(1);
    expect(gamePlayedEvents[0][0]).toEqual(
      expect.objectContaining({
        type: "GAME_PLAYED",
        payload: expect.objectContaining({
          playerMove: "SCISSORS",
          botAction: "SCISSORS",
        }),
      }),
    );
  });
});
