import { navHeader } from "@/utils/path";
import AnimateLayout from "../AnimateLayout";

const BlogLayout = ({ children, }: { children: React.ReactNode;}) => {
  return (
    <AnimateLayout className="w-full padding-body flex flex-col">
      <h1 className="font-bold max-[848px]:mx-auto text-3xl max-[720px]:text-center max-[420px]:text-[28px]">{navHeader[2].metaData.title}</h1>

      <div className="grid grid-cols-1 xs:grid-cols-[repeat(auto-fit,minmax(392px,auto))] justify-center min-[848px]:justify-between gap-6 mt-10">{children}</div>
    </AnimateLayout>
  );
};

export default BlogLayout;
