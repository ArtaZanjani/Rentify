import { Heart, Image as ImageIcon, Location } from "iconsax-react";

const HomeCardSkeleton = () => {
  return (
    <div className="relative block overflow-hidden bg-white shadow-2xl w-80 h-89 rounded-2xl animate-pulse">
      <div className="flex items-center justify-center w-full h-54 bg-g9">
        <ImageIcon className="size-20 stroke-g7" />
      </div>

      <div className="w-full p-4 space-y-3">
        <div className="flex items-center gap-x-2">
          <div className="w-16 rounded-full h-7 bg-g9"></div>
          <div className="flex items-center gap-x-2">
            <Location className="size-5 stroke-g8" />

            <div className="flex items-center gap-x-2">
              <div className="w-10 h-2 rounded-full bg-g9"></div>
              <span className="text-g3">-</span>
              <div className="w-10 h-2 rounded-full bg-g9"></div>
            </div>
          </div>
        </div>

        <div className="w-[80%] h-5 bg-g9 rounded-full"></div>

        <div className="w-full min-h-9 flex gap-x-6.5 px-1 items-center bg-g9 rounded-lg"></div>
      </div>

      <button className="absolute z-10 flex items-center justify-center rounded-full size-6 bg-g11 top-4 right-4">
        <Heart className={`size-4 fill-g8`} variant="Bold" />
      </button>
    </div>
  );
};

export default HomeCardSkeleton;
