"use client";
import Image from "next/image";
import Button from "./Button";
import { UserType } from "@/types/types";
import { useState } from "react";

const AgentCard = ({ _id, phone_number, office_name, logo }: Pick<UserType, "_id" | "phone_number" | "office_name" | "logo">) => {
  const [imgError, setImgError] = useState<boolean>(false);

  return (
    <div className="w-67 h-86.5 flex items-end">
      <div className="w-full h-[80%] hover:h-full rounded-2xl bg-white duration-200 group relative flex flex-col items-center p-2">
        <div className="size-41.5 group-hover:w-full overflow-hidden rounded-2xl group-hover:rounded-xl bg-g9 -mt-22 duration-200 group-hover:mt-0 flex items-center justify-center relative">
          {imgError || !logo?.length ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="size-12" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--color-g7)">
              <path d="M880-680v400q0 20-12.5 30T840-240q-15 0-27.5-10.5T800-281v-399H673q-17 0-32.5-6.5T614-706l-49-54H395l-10 11q-11 13-28.5 13T327-748q-11-11-11.5-27t10.5-28l10-11q11-12 26.5-19t32.5-7h170q17 0 32.5 7t26.5 19l50 54h126q33 0 56.5 23.5T880-680ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h41l80 80H160v480h601l80 80H160Zm466-215q-25 34-62.5 54.5T480-260q-75 0-127.5-52.5T300-440q0-46 20.5-83.5T375-586l58 58q-24 13-38.5 36T380-440q0 42 29 71t71 29q29 0 52-14.5t36-38.5l58 58Zm-18-233q25 24 38.5 57t13.5 71v12q0 6-1 12L456-619q6-1 12-1h12q38 0 71 13.5t57 38.5ZM791-57 55-792q-12-12-12-28.5T55-849q12-12 28.5-12t28.5 12l736 736q12 12 12 28t-12 28q-12 12-28.5 12T791-57ZM407-440Zm171-57Z" />
            </svg>
          ) : (
            <Image onError={() => setImgError(true)} src={`/api/image-proxy?url=${logo}`} alt={String(office_name)} fill sizes="100%" className="object-cover" />
          )}
        </div>

        <p className="mt-7.5 text-h6">{office_name}</p>
        <p className="mt-5 font-medium">{phone_number}</p>

        <Button href={`/agent/${_id}`} width="w-full" height="h-12" variant="fill" className="mt-auto">
          مشاهده اگهی ها
        </Button>
      </div>
    </div>
  );
};

export default AgentCard;
