import { Calendar, Image as ImageIcon } from "iconsax-react";

const BlogCardSkeleton = () => {
  return (
    <div className="w-full xs:w-98 bg-white rounded-2xl overflow-hidden flex flex-col justify-between pb-2 animate-pulse">
      <div className="w-full h-74.5 bg-g9 relative flex items-center justify-center">
        <ImageIcon className="size-20 stroke-g7" />
      </div>

      <div className="mt-4 px-2 flex flex-col flex-1">
        <div className="flex items-center gap-x-1">
          <Calendar className="size-6 stroke-g6" />
          <div className="w-16.5 h-5 bg-g9 rounded-md"></div>
        </div>
        <div className="w-full h-6 bg-g9 mt-4 rounded-md"></div>

        <div className="w-full h-5.5 bg-g9 mt-2 rounded-md"></div>
        <div className="w-full h-5.5 bg-g9 mt-1 rounded-md"></div>

        <button className="w-full mt-3 h-12 bg-g9 rounded-lg flex items-center justify-center"></button>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
