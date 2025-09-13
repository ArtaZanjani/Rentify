"use client";
import { useAuth } from "@/context/AuthProvider";
import type { UserType } from "@/types/types";
import Table from "../shared/table";
import { useActionState, useEffect, useState } from "react";
import Dialog from "@/components/common/Dialog";
import { motion } from "motion/react";
import { dialogVariants } from "@/utils/Animations";
import { Add } from "iconsax-react";
import Button from "@/components/common/Button";
import { banTimes, translateRole } from "@/utils/countOccurrences";
import { BanUser } from "@/actions/admin";
import { toast } from "sonner";
import { formatBanTime } from "@/utils/dayjs";
import { useRouter } from "next/navigation";

type AdminTableType = {
  method: "BAN" | "CHANGE_ROLE" | null;
  id: string | null;
};

const AdminTable = ({ users }: { users: Pick<UserType, "_id" | "name" | "last_name" | "phone_number" | "role" | "banTime" | "isBanned">[] }) => {
  const { user } = useAuth();

  const [id, setId] = useState<AdminTableType>({
    method: null,
    id: null,
  });
  const [hoverValue, setHoverValue] = useState<string | null>(null);

  const filtredUser = users.filter((e) => e._id !== user?._id);
  const userFind = filtredUser.find((e) => e._id === id.id);

  const [stateCode, formActionCode] = useActionState(BanUser, {
    message: "",
    error: false,
  });

  const { refresh } = useRouter();

  useEffect(() => {
    if (stateCode.message.length) {
      if (stateCode.error) {
        toast.error(stateCode.message);
      } else {
        setId({
          method: null,
          id: null,
        });

        toast.success(stateCode.message);
        refresh();
      }
    }
  }, [stateCode, refresh]);

  return (
    <>
      <Table itemLength={filtredUser.length}>
        <thead className="border-b-2 border-g9">
          <tr>
            {["نام", "نام خانوادگی", "نقش"].map((e, index) => (
              <th className="h-24 px-8" key={index}>
                <p className="text-lg text-g2">{e}</p>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filtredUser.map((row, index) => (
            <tr key={index} className="border-b border-g9 last:border-0">
              <td className="h-24 px-8 bg-white">
                <p className="text-h6">{row.name}</p>
              </td>
              <td className="h-24 px-8 bg-white">
                <p className="text-h6">{row.last_name}</p>
              </td>
              <td className="h-24 px-8 bg-white">
                <p className="text-h6">{translateRole[row.role]}</p>
              </td>
              <td className="bg-white px-8 h-24">
                <button onClick={() => setId({ method: "BAN", id: row._id })} className="border border-states-error1 px-5 py-2 rounded-md hover:bg-states-error1 duration-200 hover:text-white">
                  بن کاربر
                </button>

                <button onClick={() => setId({ method: "CHANGE_ROLE", id: row._id })} className="border mr-3 border-states-error1 px-5 py-2 rounded-md hover:bg-states-error1 duration-200 hover:text-white">
                  تغییر نقش
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Dialog open={userFind !== undefined} close={() => setId({ method: null, id: null })}>
        <motion.form action={formActionCode} variants={dialogVariants} initial="hidden" animate={userFind !== undefined ? "visible" : "hidden"} exit="exit" className="w-[95%] sm:w-[600px] min-h-fit flex flex-col bg-white rounded-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 z-10 flex items-center justify-between w-full p-6 pb-4 bg-white border-b">
            <p className="text-lg font-bold truncate w-[80%]">
              {userFind?.name} {userFind?.last_name}
            </p>
            <button type="button" onClick={() => setId({ method: null, id: null })} className="rounded-full hover:bg-g8">
              <Add className="rotate-45 size-9 stroke-black" />
            </button>
          </div>

          {id?.method === "BAN" && (
            <div className="w-full space-y-3 p-6">
              <p>{formatBanTime(userFind?.banTime, userFind?.isBanned)}</p>
              <div className="w-full grid grid-cols-2 justify-between gap-4 flex-wrap">
                {banTimes.map((e, index) => (
                  <Button type="submit" onMouseEnter={() => setHoverValue(e)} onMouseLeave={() => setHoverValue(null)} key={index} variant="outline" width="w-full" height="h-12" className={`${index === banTimes.length - 1 && "col-span-2"}`}>
                    {e}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {id?.method === "CHANGE_ROLE" && (
            <div className="p-6 space-y-4">
              {Object.entries(translateRole)
                .filter(([key]) => userFind?.role !== key)
                .map(([key, label]) => (
                  <Button type="submit" onMouseEnter={() => setHoverValue(key)} onMouseLeave={() => setHoverValue(null)} key={key} variant="outline" width="w-full" height="h-12">
                    {label}
                  </Button>
                ))}
            </div>
          )}

          {userFind?._id && id?.method && (
            <>
              <input type="hidden" name="method" value={id?.method} />
              <input type="hidden" name="userId" value={userFind?._id} />

              {hoverValue && <input type="hidden" name="value" value={hoverValue} />}
            </>
          )}
        </motion.form>
      </Dialog>
    </>
  );
};

export default AdminTable;
