import AgentCardSkeleton from "@/components/skeleton/AgentCardSkeleton";

const Loading = () => {
  return (
    <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(268,auto))] justify-center min-[720px]:justify-between gap-10 mt-7">
      {Array.from({ length: 4 }).map((_, index) => (
        <AgentCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default Loading;
