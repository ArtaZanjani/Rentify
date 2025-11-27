import BlogCard from "@/components/common/BlogCard";
import connectToDB from "@/configs/connectToDB";
import BlogModel from "@/models/BlogModel";
import { BlogType, ParamsProps } from "@/types/types";
import BlogLayout from "@/components/blog/BlogLayout";
import { Metadata } from "next";
import LimitBtn from "@/components/common/LimitBtn";
import { navHeader } from "@/utils/path";
import ErrorUi from "@/components/ErrorUi";
import { Messages } from "@/utils/messages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = navHeader[2].metaData;

const Blog = async ({ searchParams }: ParamsProps) => {
  await connectToDB();
  const limit = (await searchParams)?.limit;
  const parsedLimit = Number(limit) || 4;

  const blogs = await BlogModel.find({}).sort({ _id: -1 }).limit(parsedLimit);
  const blogsLength = await BlogModel.countDocuments({});

  const parsedData: BlogType[] = JSON.parse(JSON.stringify(blogs));

  return (
    <>
      {parsedData && parsedData.length ? (
        <>
          <BlogLayout>
            {parsedData.map((e) => (
              <BlogCard key={String(e._id)} {...e} />
            ))}
          </BlogLayout>
          {parsedLimit < blogsLength && <LimitBtn limit={parsedLimit} label="نمایش مقاله های بیشتر" />}
        </>
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

export default Blog;
