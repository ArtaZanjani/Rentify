import AnimateLayout from "@/components/AnimateLayout";
import { navHeader } from "@/utils/path";
import connectToDB from "@/configs/connectToDB";
import UnderlineTabs from "@/components/common/UnderlineTabs";
import { agentSortArr } from "@/utils/countOccurrences";

const Agents = async ({ children }: { children: React.ReactNode }) => {
  await connectToDB();

  return (
    <AnimateLayout heading={navHeader[1].metaData.title} className="w-full padding-body space-y-10">
      <UnderlineTabs tabs={agentSortArr} paramsValue="sort" />

      {children}
    </AnimateLayout>
  );
};

export default Agents;
