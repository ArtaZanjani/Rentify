"use client";
import { InputTypes, UserType } from "@/types/types";
import { Call, User } from "iconsax-react";
import { useActionState, useEffect, useState } from "react";
import Input from "../common/Input";
import { handleInputChange, resetInputValue } from "@/utils/form";
import { isPersian } from "@/utils/validation";
import BtnForm from "../auth/BtnForms";
import { newMessage } from "@/actions/action_contact_us";
import { toast } from "sonner";

const ContactUsForm = ({ name, last_name, phone_number }: Pick<UserType, "name" | "last_name" | "phone_number">) => {
  const [inputs, setInputs] = useState<InputTypes[]>([
    {
      label: "نام",
      name: "name",
      id: "input_name",
      type: "text",
      icon: User,
      value: "",
      error: "",
    },
    {
      label: "نام خانوادگی",
      name: "last_name",
      id: "input_last_name",
      type: "text",
      icon: User,
      value: "",
      error: "",
    },
    {
      label: "تلفن همراه",
      name: "phone_number",
      id: "input_phone_number",
      type: "tel",
      icon: Call,
      value: "",
      error: "",
    },
  ]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if ([name, last_name, phone_number].some((e) => e?.trim().length)) {
      handleInputChange(inputs, setInputs, "name", name, "any");
      handleInputChange(inputs, setInputs, "last_name", last_name, "any");
      handleInputChange(inputs, setInputs, "phone_number", phone_number, "just_number");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, last_name, phone_number]);

  const checkValue = inputs.every((e) => e.value.length && !e.error) && message.length > 0;

  const [state, formAction] = useActionState(newMessage, {
    message: "",
    error: false,
  });

  useEffect(() => {
    if (state.message.length) {
      if (state.error) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
        setMessage("");
      }
    }
  }, [state]);

  return (
    <form action={formAction} className="flex-1 max-w-[700px] h-fit grid grid-cols-2 justify-start gap-x-4 gap-y-8">
      {inputs.map((e, index) => {
        const prefilled = (e.name === "name" && name) || (e.name === "last_name" && last_name) || (e.name === "phone_number" && phone_number);

        return <Input key={index} inputClassName={`h-12 w-full ${prefilled && "cursor-not-allowed"}`} divClassName={`${prefilled && "opacity-50"} ${index === inputs.length - 1 && "col-span-2"}`} labelBgColor="bg-gray" Icon={e.icon} label={e.label} id={e.id} name={e.name} type={e.type} value={e.value} error={e.error} onChange={(i) => (prefilled ? null : handleInputChange(inputs, setInputs, e.name, i.target.value, e.type === "tel" ? "just_number" : "any"))} ResetValue={() => (prefilled ? null : resetInputValue(inputs, setInputs, e.name))} />;
      })}

      <textarea dir={!message.length ? "rtl" : isPersian(message) ? "rtl" : "ltr"} name="message" placeholder="پیام خود را اینجا بنویسید..." className={`w-full col-span-full h-43 placeholder:text-g4 ${message.length ? "border-primary text-primary" : "border-g8 hover:border-g1"} border duration-200 rounded-2xl resize-none p-4`} value={message} onChange={(e) => setMessage(e.target.value)}></textarea>

      <BtnForm label="ارسال پیام" check={checkValue} className="col-span-full" />
    </form>
  );
};

export default ContactUsForm;
