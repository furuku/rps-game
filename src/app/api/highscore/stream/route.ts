import { NextRequest, NextResponse } from "next/server"; // 👈 อย่าลืม Import NextRequest
import { gameEvents } from "@/lib/events";
import "@/lib/rabbitmq/init";

export const dynamic = "force-dynamic";

// Request handler
export async function GET(req: NextRequest) {
  let onUpdate: (newScore: number) => void;

  const stream = new ReadableStream({
    start(controller) {
      onUpdate = (newScore: number) => {
        const data = `data: ${JSON.stringify({ highScore: newScore })}\n\n`;
        controller.enqueue(new TextEncoder().encode(data));
      };
      // Capture new high score
      gameEvents.on("highScoreUpdate", onUpdate);

      // Capture when the client is closed or refreshed
      req.signal.addEventListener("abort", () => {
        gameEvents.off("highScoreUpdate", onUpdate);
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
