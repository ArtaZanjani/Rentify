import type { ParamsProps, BlogType } from "@/types/types";
import connectToDB from "@/configs/connectToDB";
import BlogModel from "@/models/BlogModel";
import { isValidObjectId } from "mongoose";
import BlogIdImage from "@/components/blog/BlogIdImage";
import { sanitizeHTML } from "@/utils/sanitizeHTML";
import { Metadata } from "next";
import ErrorUi from "@/components/ErrorUi";
import { Messages } from "@/utils/messages";

export const dynamic = "force-dynamic";

const fetchBlogById = async (id: string): Promise<BlogType | null> => {
  if (!id || !isValidObjectId(id)) return null;
  await connectToDB();

  const blogFind = await BlogModel.findById(id);

  if (!blogFind) return null;

  return JSON.parse(JSON.stringify(blogFind));
};

const BlogId = async ({ params }: ParamsProps) => {
  const id = (await params)?.id ?? "";
  const parsedData = await fetchBlogById(id);

  if (!parsedData) {
    return (
      <ErrorUi
        title={Messages["404_Blog"].title}
        description={Messages["404_Blog"].description}
        btn={{
          label: Messages["404_Blog"].btnLabel,
          action: { path: "/blog", navigate: "replace" },
        }}
        img={{ src: "/images/illustrations/404.png", alt: "404" }}
      />
    );
  }

  const clean = sanitizeHTML(parsedData.mainContent);

  return (
    <>
      <h1 className="text-[clamp(16px,calc(2.5vw+10px),32px)] font-bold w-fit">{parsedData?.title.slice(0, 50)}</h1>

      <BlogIdImage image={parsedData?.image ?? ""} title={parsedData?.title} />

      <div className="w-full mt-10" dangerouslySetInnerHTML={{ __html: clean }} />
    </>
  );
};

export default BlogId;

export const generateMetadata = async ({ params }: ParamsProps): Promise<Metadata> => {
  const id = (await params)?.id ?? "";
  const parsedData = await fetchBlogById(id);

  if (!parsedData) {
    return {
      title: Messages["404_Blog"].title,
    };
  }

  return {
    title: parsedData?.title,
    description: parsedData?.shortDesciption,
  };
};
