import HomeCardSkeleton from "@/components/skeleton/HomeCardSkeleton";

const Loading = () => {
  return (
    <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(320px,auto))] min-[1128px]:p-6 justify-center min-[720px]:justify-between gap-10 mt-8 rounded-2xl min-[1128px]:bg-white">
      {Array.from({ length: 4 }).map((_, i) => (
        <HomeCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default Loading;
