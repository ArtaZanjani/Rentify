import { Metadata } from "next";
import connectToDB from "@/configs/connectToDB";
import ContactUsModel from "@/models/ContactUsModel";
import AdminMessages from "@/components/dashboard/admin/AdminMessages";
import ErrorUi from "@/components/ErrorUi";
import { ContactUsTypes } from "@/types/types";
import { Messages } from "@/utils/messages";
import { path_admin } from "@/utils/path";

export const metadata: Metadata = path_admin[3].metaData;

export const dynamic = "force-dynamic";

const AdminContactUs = async () => {
  await connectToDB();
  const messages = await ContactUsModel.find({}, "-__v").sort({ _id: -1 });

  const parsedData: ContactUsTypes[] = JSON.parse(JSON.stringify(messages));

  return (
    <>
      {parsedData && parsedData.length ? (
        <AdminMessages parsedData={parsedData} />
      ) : (
        <div className="min-[1128px]:bg-white min-[1128px]:p-6 mt-8 rounded-2xl flex-1">
          <ErrorUi
            title={Messages.noMessages.title}
            description={Messages.noMessages.description}
            btn={{
              label: Messages.noMessages.btnLabel,
              action: { path: "/" },
            }}
            img={{
              src: "/images/illustrations/wish-list.png",
              alt: "صفحه اصلی",
            }}
          />
        </div>
      )}
    </>
  );
};

export default AdminContactUs;
