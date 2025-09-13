"use client";
import ErrorUi from "@/components/ErrorUi";
import { useRouter } from "next/navigation";
import { Messages } from "@/utils/messages";
const HomesShow_Error = () => {
  const { refresh } = useRouter();

  return (
    <ErrorUi
      title={Messages.unknownError.title}
      description={Messages.unknownError.description}
      btn={{
        label: Messages.unknownError.btnLabel,
        action: {
          onClick: () => refresh(),
        },
      }}
      img={null}
    />
  );
};

export default HomesShow_Error;
