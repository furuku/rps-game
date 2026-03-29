import { NextRequest, NextResponse } from "next/server";
import { subscribe } from "@/lib/rabbitmq/consumer";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  let unsubscribe: () => void;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // subscribe RabbitMQ events
      unsubscribe = subscribe((score) => {
        const data = `data: ${JSON.stringify({ highScore: score })}\n\n`;
        controller.enqueue(encoder.encode(data));
      });

      req.signal.addEventListener("abort", () => {
        unsubscribe();
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
