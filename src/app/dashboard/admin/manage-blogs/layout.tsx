import AnimateLayout from "@/components/AnimateLayout";
import { path_admin } from "@/utils/path";

const ManageBlogs = async ({ children }: { children: React.ReactNode }) => {
  return (
    <AnimateLayout heading={path_admin[5].metaData.title}>
      <div className="w-full rounded-2xl min-[1208px]:bg-white min-[1208px]:p-6 mt-10">{children}</div>
    </AnimateLayout>
  );
};

export default ManageBlogs;
