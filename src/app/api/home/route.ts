import connectToDB from "@/configs/connectToDB";
import { NextRequest, NextResponse } from "next/server";
import HomeModel from "@/models/HomeModel";
import { isValidObjectId } from "mongoose";
import { Messages, mongooseDuplicateError } from "@/utils/messages";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const userId = req.nextUrl.searchParams.get("userId");
    const idsParam = req.nextUrl.searchParams.get("ids");
    const ids: string[] = idsParam ? idsParam.split(",").filter(Boolean) : [];

    if (userId && ids.length > 0) {
      return NextResponse.json({ message: "لطفاً تنها یکی از پارامترهای homeId یا ids را ارسال کنید" }, { status: 400 });
    }

    if (userId) {
      if (!isValidObjectId(userId)) {
        return NextResponse.json({ message: mongooseDuplicateError.isValidObjectId }, { status: 400 });
      }

      const home = await HomeModel.find({ postedBy: userId }).sort({ _id: -1 });
      return NextResponse.json(home, { status: 200 });
    }

    const validIds = ids.filter((id) => isValidObjectId(id));

    if (validIds.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const homes = await HomeModel.find({ _id: { $in: validIds }, status: "active" }).sort({ _id: -1 });
    return NextResponse.json(homes || [], { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: Messages.unknownError.description, error: err }, { status: 500 });
  }
};
