import HomeCardSkeleton from "@/components/skeleton/HomeCardSkeleton";

const HomeShow_Loading = () => {
  return (
    <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(320px,auto))] justify-center min-[720px]:justify-between gap-10 mt-7">
      {Array.from({ length: 4 }).map((e, index) => (
        <HomeCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default HomeShow_Loading;
