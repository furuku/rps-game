import amqp from "amqplib";

export async function sendGameLog(message: string) {
  const conn = await amqp.connect(process.env.RABBITMQ_URL!);
  const channel = await conn.createChannel();

  await channel.assertQueue("game_logs");

  channel.sendToQueue("game_logs", Buffer.from(message));

  await channel.close();
  await conn.close();
}