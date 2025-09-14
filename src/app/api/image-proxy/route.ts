import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Response(buffer, {
      headers: {
        "Content-Type": response.headers.get("content-type") || "image/*",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error fetching image" }, { status: 500 });
  }
}
