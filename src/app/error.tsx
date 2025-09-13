"use client";
import ErrorUi from "@/components/ErrorUi";
import { Messages } from "@/utils/messages";

const Error = () => {
  
  return (
    <ErrorUi
      title={Messages.unknownError.title}
      description={Messages.unknownError.description}
      img={{ src: "/images/illustrations/Internal Server.png", alt: Messages.unknownError.title }}
      btn={{
        label: Messages.unknownError.btnLabel,
        action: {
          onClick: () => window.location.reload(),
        },
      }}
    />
  );
};

export default Error;
