import BlogCardSkeleton from "@/components/skeleton/BlogCardSkeleton";

const Loading = () => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-[repeat(auto-fit,minmax(392px,auto))] justify-center min-[1208px]:justify-between md:justify-start gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default Loading;
