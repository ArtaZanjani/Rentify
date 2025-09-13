import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/configs/connectToDB";
import OTPModel from "@/models/OTPModel";
import { Messages } from "@/utils/messages";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { phone_number } = await req.json();
    if (!phone_number) return NextResponse.json({ error: "شماره موبایل لازم است" }, { status: 400 });

    await OTPModel.findOneAndDelete({ phone_number });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: Messages.unknownError.description }, { status: 500 });
  }
};
