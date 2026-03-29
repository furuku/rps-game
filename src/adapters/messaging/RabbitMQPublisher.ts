import amqp from "amqplib";
import { GameEventPublisher } from "@/core/ports/GameEventPublisher";
import { GameEvent } from "@/core/events/GameEvent";

export class RabbitMQPublisher implements GameEventPublisher {
  async publishGameEvent(event: GameEvent): Promise<void> {
    const conn = await amqp.connect(process.env.RABBITMQ_URL!);
    const channel = await conn.createChannel();

    await channel.assertQueue("game_events");

    channel.sendToQueue(
      "game_events",
      Buffer.from(JSON.stringify(event))
    );

    await channel.close();
    await conn.close();
  }
}