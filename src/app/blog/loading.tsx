import BlogCardSkeleton from "@/components/skeleton/BlogCardSkeleton";
import BlogLayout from "@/components/blog/BlogLayout";

const Loading = () => {
  return (
    <BlogLayout>
      {Array.from({ length: 4 }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </BlogLayout>
  );
};

export default Loading;
