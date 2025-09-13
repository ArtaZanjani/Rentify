import AnimateLayout from "@/components/AnimateLayout";
import PersonalInformation from "@/components/dashboard/shared/PersonalInformation";
import type { Metadata } from "next";
import { path_user } from "@/utils/path";

export const metadata: Metadata = path_user[0].metaData;
export const dynamic = "force-dynamic";

const UserPage = () => {
  return (
    <AnimateLayout heading={path_user[0].metaData.title}>
      <PersonalInformation />
    </AnimateLayout>
  );
};

export default UserPage;
