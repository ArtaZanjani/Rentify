import React from "react";
import { Image as ImageIcon } from "iconsax-react";

const AgentCardSkeleton = () => {
  return (
    <div className="w-67 h-86.5 flex items-end animate-pulse">
      <div className="w-full h-[80%] hover:h-full rounded-2xl bg-white duration-200 group relative flex flex-col items-center p-2">
        <div className="size-41.5 group-hover:w-full overflow-hidden rounded-2xl group-hover:rounded-xl bg-g9 -mt-22 duration-200 group-hover:mt-0 flex items-center justify-center relative">
          <ImageIcon className="size-12 stroke-g7" />
        </div>

        <p className="mt-7.5 text-h6 w-20 h-6.5 bg-g9 rounded-md"></p>
        <p className="mt-5 font-medium w-25 h-6 bg-g9 rounded-md"></p>

        <div className="w-full mt-auto h-12 bg-g9 rounded-xl"></div>
      </div>
    </div>
  );
};

export default AgentCardSkeleton;
