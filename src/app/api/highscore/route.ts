import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const hsRecord = await prisma.highScore.findUnique({
      where: { id: 1 },
    });
    const yourScore = parseInt(
      cookieStore.get("your-score")?.value || "0"
    );

    return NextResponse.json({
      highScore: hsRecord?.score || 0,
      yourScore: yourScore,
    });
  } catch (error) {
    return NextResponse.json({
      highScore: 0,
      yourScore: 0,
    });
  }
}
