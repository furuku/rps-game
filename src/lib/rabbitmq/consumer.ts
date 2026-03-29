import amqp from "amqplib";

type Listener = (score: number) => void;

const listeners = new Set<Listener>();

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function startConsumer() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL!);
  const channel = await conn.createChannel();

  await channel.assertQueue("game_events");

  channel.consume("game_events", (msg) => {
    if (!msg) return;

    const event = JSON.parse(msg.content.toString());

    if (event.type === "HIGH_SCORE_UPDATED") {
      const score = event.payload.score;

      // 🔥 broadcast ไป SSE ทุก client
      for (const listener of listeners) {
        listener(score);
      }
    }

    channel.ack(msg);
  });
}