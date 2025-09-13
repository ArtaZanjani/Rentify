import CompareComp from "@/components/dashboard/shared/CompareComp";
import { Metadata } from "next";
import { path_user } from "@/utils/path";

export const metadata: Metadata = path_user[4].metaData;
export const dynamic = "force-dynamic";

const Compare = () => {
  return <CompareComp />;
};

export default Compare;
