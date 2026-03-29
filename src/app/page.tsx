"use client";
import { useEffect, useRef, useState } from "react";
import { GameAction } from "@/core/entities/game";

export default function RPSGame() {
  const [yourScore, setYourScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  type BotState = GameAction | "???";
  const [botAction, setBotAction] = useState<BotState>("???");
  const [isWaiting, setIsWaiting] = useState(false);
  const [resultMsg, setResultMsg] = useState("");
  const actions: GameAction[] = ["ROCK", "PAPER", "SCISSORS"];
  const handlePlay = async (playerMove: GameAction) => {
    if (isWaiting) return; // Prevent double click

    setIsWaiting(true);
    setResultMsg("");

    try {
      const res = await fetch("/api/play", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerAction: playerMove }),
      });
      const data = await res.json();
      if (!data?.botAction || !data?.result) {
        throw new Error("Invalid response");
      }

      // Show bot action
      setBotAction(data.botAction);
      setResultMsg(`YOU ${data.result}!`);

      // Wait for 2 seconds
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setYourScore(data.nextYourScore);
        setHighScore(data.nextHighScore);
        setBotAction("???");
        setResultMsg("");
        setIsWaiting(false);
      }, 2000);
    } catch (e) {
      setResultMsg("ERROR! TRY AGAIN");
      setIsWaiting(false);
    }
  };

  useEffect(() => {
    const loadInitialScores = async () => {
      try {
        const res = await fetch("/api/highscore");
        const data = await res.json();

        setHighScore(data.highScore ?? 0);
        setYourScore(data.yourScore ?? 0);
      } catch (err) {
        console.error("Initial load failed:", err);
      }
    };

    loadInitialScores();

    const eventSource = new EventSource("/api/events");
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setHighScore(data.highScore ?? 0);
    };

    eventSource.onerror = () => {
      console.error("SSE error");
      eventSource.close();
    };

    return () => {
      eventSource.close();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      {/* Score */}
      <div className="mb-8 text-right w-full max-w-sm">
        <p>
          Your Score:{" "}
          <span
            data-testid="your-score"
            className="text-2xl font-bold text-blue-400"
          >
            {yourScore}
          </span>{" "}
          turn
        </p>
        <p>
          High Score:{" "}
          <span
            data-testid="high-score"
            className="text-2xl font-bold text-yellow-400"
          >
            {highScore}
          </span>{" "}
          turn
        </p>
      </div>

      {/* Bot Actions */}
      <div className="mb-12 text-center">
        <p className="text-slate-400 mb-2">Bot action:</p>
        <div
          data-testid="bot-action"
          className="w-32 h-32 bg-slate-800 rounded-xl flex items-center justify-center text-4xl border-2 border-slate-700 shadow-xl"
        >
          {botAction}
        </div>
        <p className="mt-4 font-bold h-6">{resultMsg}</p>
      </div>

      {/* Player Actions */}
      <div className="w-full max-w-sm">
        <p className="mb-4 text-center text-slate-400">Your action:</p>
        <div className="grid grid-cols-3 gap-4">
          {actions.map((a) => (
            <button
              key={a}
              onClick={() => handlePlay(a)}
              disabled={isWaiting}
              data-testid={`btn-${a.toLowerCase()}`}
              className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all border-b-4 border-slate-900 active:border-b-0 cursor-pointer"
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
