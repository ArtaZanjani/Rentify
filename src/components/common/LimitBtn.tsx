"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useState } from "react";
import Button from "./Button";
import Spinner from "./Spinner";

const LimitBtn = ({ limit, label }: { limit: number; label: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = () => {
    setIsLoading(true);

    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(limit + 4));
    router.replace(`?${params.toString()}`, { scroll: false });

    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
      setIsLoading(false);
    });
  };

  return (
    <Button width="w-fit" height="h-12" variant="fill" className="mx-auto mt-10" onClick={() => (isLoading ? null : loadMore())}>
      {isLoading ? <Spinner className="size-7 fill-white" /> : label}
    </Button>
  );
};

export default LimitBtn;
