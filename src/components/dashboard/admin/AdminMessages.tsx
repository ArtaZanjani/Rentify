"use client";
import Button from "@/components/common/Button";
import Table from "../shared/table";
import { ContactUsTypes } from "@/types/types";
import { useActionState, useEffect, useState } from "react";
import { motion } from "motion/react";
import Dialog from "@/components/common/Dialog";
import { dialogVariants } from "@/utils/Animations";
import { Add } from "iconsax-react";
import { delleteMessage } from "@/actions/action_contact_us";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import BtnForm from "@/components/auth/BtnForms";

const AdminMessages = ({ parsedData }: { parsedData: ContactUsTypes[] }) => {
  const [id, setId] = useState<string | null>(null);
  const { refresh } = useRouter();

  const messageFind = parsedData.find((e) => e._id === id);

  const [state, formAction] = useActionState(delleteMessage, {
    message: "",
    error: false,
  });

  useEffect(() => {
    if (state.message.length) {
      if (state.error) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
        setId(null);
        refresh();
      }
    }
  }, [state, refresh]);
  return (
    <>
      <Table itemLength={parsedData.length}>
        <thead className="border-b-2 border-g9">
          <tr>
            {["نام", "نام خانوادگی", "پیام"].map((e, index) => (
              <th className="h-24 px-8" key={index}>
                <p className="text-lg text-g2">{e}</p>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {parsedData.map((row, index) => (
            <tr key={index} className="border-b border-g9 last:border-0">
              <td className="h-24 px-8 bg-white">
                <p className="text-h6">{row.name}</p>
              </td>
              <td className="h-24 px-8 bg-white">
                <p className="text-h6">{row.last_name}</p>
              </td>


              <td className="bg-white px-8 h-24">
                <Button width="w-fit" height="h-12" variant="fill" onClick={() => setId(row._id)}>
                  دیدن پیام
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Dialog open={messageFind !== undefined} close={() => setId(null)}>
        <motion.form action={formAction} variants={dialogVariants} initial="hidden" animate={messageFind !== undefined ? "visible" : "hidden"} exit="exit" className="w-[95%] overflow-hidden sm:w-[600px] min-h-fit flex flex-col bg-white rounded-xl" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 z-10 flex items-center justify-between w-full p-6 pb-4 bg-white border-b">
            <p className="text-lg font-bold truncate w-[80%]">
              {messageFind?.name} {messageFind?.last_name}
            </p>
            <button type="button" onClick={() => setId(null)} className="rounded-full hover:bg-g8">
              <Add className="rotate-45 size-9 stroke-black" />
            </button>
          </div>

          <div className="p-6 overflow-y-scroll h-80">{messageFind?.message}</div>

          <div className="px-1 bottom-1 left-0 sticky mt-2">
            <BtnForm label="حذف پیام" check />
          </div>

          <input type="hidden" name="id" value={messageFind?._id} />
        </motion.form>
      </Dialog>
    </>
  );
};

export default AdminMessages;
