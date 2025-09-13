import connectToDB from "@/configs/connectToDB";
import { NextRequest, NextResponse } from "next/server";
import ReservationDateModel from "@/models/ReservationDateModel";
import { isValidObjectId } from "mongoose";
import { validateDate } from "@/utils/validation";
import { Messages, mongooseDuplicateError } from "@/utils/messages";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();
    const body = await req.json();

    const { id, date, clock, ...rest } = body;

    if (Object.keys(rest).length) {
      return NextResponse.json({ message: "فیلدهای اضافی در درخواست وجود دارد", rest }, { status: 400 });
    }

    const result = validateDate(id, date, clock);
    if (result.status !== 200) {
      return NextResponse.json({ message: result.message }, { status: result.status });
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: mongooseDuplicateError.isValidObjectId }, { status: 400 });
    }

    const reservationDoc = await ReservationDateModel.findById(id);

    if (!reservationDoc) {
      await ReservationDateModel.create({
        _id: id,
        pickedDate: [{ date, clock }],
      });
      return NextResponse.json({ message: "تاریخ با موفقیت ثبت شد" }, { status: 201 });
    }

    if (reservationDoc.pickedDate.find((e) => e.date === date && e.clock === clock)) {
      return NextResponse.json({ message: "این تاریخ قبلا با همین ساعت ثبت شده است" }, { status: 409 });
    }

    await ReservationDateModel.findByIdAndUpdate(id, { $addToSet: { pickedDate: { date, clock } } }, { new: true, upsert: true });

    return NextResponse.json({ message: "تاریخ با موفقیت ثبت شد" }, { status: 201 });
  } catch {
    return NextResponse.json({ message: Messages.unknownError.description }, { status: 500 });
  }
};
