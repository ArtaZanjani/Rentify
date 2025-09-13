"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SetSort = ({ sort, pathname }: { sort: string | undefined; pathname: string }) => {
  const { replace } = useRouter();
  useEffect(() => {
    if (!sort) {
      replace(pathname);
    }
  }, [replace, pathname, sort]);
  return null;
};

export default SetSort;
