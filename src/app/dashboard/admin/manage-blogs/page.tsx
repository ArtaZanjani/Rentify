import ErrorUi from "@/components/ErrorUi";
import connectToDB from "@/configs/connectToDB";
import BlogModel from "@/models/BlogModel";
import { BlogType, ParamsProps } from "@/types/types";
import { Messages } from "@/utils/messages";
import ManageBlogsComp from "@/components/dashboard/admin/ManageBlogsComp";
import { Metadata } from "next";
import { path_admin } from "@/utils/path";
export const metadata: Metadata = path_admin[5].metaData;
export const dynamic = "force-dynamic";
const ManageBlogs = async ({ searchParams }: ParamsProps) => {
  await connectToDB();
  const limit = (await searchParams)?.limit;
  const parsedLimit = Number(limit) || 4;
  const blogs = await BlogModel.find({}).sort({ _id: -1 }).limit(parsedLimit);
  const parsedData: BlogType[] = JSON.parse(JSON.stringify(blogs));
  const totalBlogsCount = await BlogModel.countDocuments({});

  return (
    <>
      {parsedData && parsedData.length ? (
        <ManageBlogsComp parsedData={parsedData} parsedLimit={parsedLimit} totalBlogsCount={totalBlogsCount} />
      ) : (
        <ErrorUi
          title={Messages.noBlogs.title}
          description={Messages.noBlogs.description}
          btn={{
            label: Messages.noBlogs.btnLabel,
            action: { path: "/", navigate: "replace" },
          }}
          img={{ src: "/images/illustrations/wish-list.png", alt: "404" }}
        />
      )}
    </>
  );
};

export default ManageBlogs;
