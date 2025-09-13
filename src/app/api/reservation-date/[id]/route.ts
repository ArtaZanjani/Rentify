import connectToDB from "@/configs/connectToDB";
import { NextRequest, NextResponse } from "next/server";
import ReservationDateModel from "@/models/ReservationDateModel";
import { isValidObjectId } from "mongoose";
import type { ParamsProps } from "@/types/types";
import { Messages, mongooseDuplicateError } from "@/utils/messages";

export const GET = async (req: NextRequest, { params }: ParamsProps) => {
  try {
    await connectToDB();

    const id = (await params)?.id ?? "";

    if (!id) {
      return NextResponse.json({ message: mongooseDuplicateError.id }, { status: 404 });
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: mongooseDuplicateError.isValidObjectId }, { status: 400 });
    }

    const reservationDoc = await ReservationDateModel.findById(id, "-__v");

    if (!reservationDoc) {
      return NextResponse.json({ pickedDate: [] }, { status: 200 });
    }

    return NextResponse.json(reservationDoc, { status: 200 });
  } catch {
    return NextResponse.json({ message: Messages.unknownError.description }, { status: 500 });
  }
};
