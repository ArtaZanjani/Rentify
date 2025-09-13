"use client";

import { useMemo } from "react";

const Table = ({ children, itemLength }: { children: React.ReactNode; itemLength: number }) => {
  const tableHeight = useMemo(() => `${96 * (itemLength + 1)}px`, [itemLength]);

  return (
    <div className="relative flex flex-col w-full h-full mt-8 overflow-x-auto overflow-y-hidden bg-white rounded-2xl" style={{ height: tableHeight }}>
      <table className="top-0 right-0 z-10 w-full text-right table-auto min-w-max md:absolute">{children}</table>
    </div>
  );
};

export default Table;
