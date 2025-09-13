import AnimateLayout from "@/components/AnimateLayout";
import PersonalInformation from "@/components/dashboard/shared/PersonalInformation";
import { path_admin } from "@/utils/path";
import type { Metadata } from "next";

export const metadata: Metadata = path_admin[0].metaData;

export const dynamic = "force-dynamic";

const AdminPage = () => {
  return (
    <AnimateLayout heading={path_admin[0].metaData.title}>
      <PersonalInformation />
    </AnimateLayout>
  );
};

export default AdminPage;
