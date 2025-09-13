import AnimateLayout from "@/components/AnimateLayout";
import MainEditor from "@/components/TextEditor/MainEditor";
import { path_admin } from "@/utils/path";
import { Metadata } from "next";
export const metadata: Metadata = path_admin[4].metaData;
export const dynamic = "force-dynamic";

const Blog = () => {
  return (
    <AnimateLayout heading={path_admin[4].metaData.title}>
      <MainEditor />
    </AnimateLayout>
  );
};

export default Blog;
