import HomeModel from "@/models/HomeModel";
import connectToDB from "@/configs/connectToDB";
import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const idsParam = req.nextUrl.searchParams.get("ids");
    const ids: string[] = idsParam ? idsParam.split(",").filter(Boolean) : [];

    if (ids.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const validIds = ids.filter((id) => isValidObjectId(id));

    if (validIds.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const homes = await HomeModel.find({ _id: { $in: validIds }, status: "active" });

    return NextResponse.json(homes || [], { status: 200 });
  } catch {
    return NextResponse.json([], { status: 500 });
  }
};
