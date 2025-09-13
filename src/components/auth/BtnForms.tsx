"use client";
import { useFormStatus } from "react-dom";
import Button from "../common/Button";
import Spinner from "../common/Spinner";

type BtnFormPropsType = {
  label: string;
  check: boolean;
  width?: "w-full" | "w-fit";
  className?: string;
};

const BtnForm = ({ label, check, width = "w-full", className = "mt-8", ...rest }: BtnFormPropsType) => {
  const { pending } = useFormStatus();

  return (
    <Button type={check ? "submit" : "button"} width={width} height="h-12" variant="fill" className={className} disabled={!check || pending} {...rest}>
      {pending ? <Spinner className="size-7 fill-g6" /> : label}
    </Button>
  );
};

export default BtnForm;
