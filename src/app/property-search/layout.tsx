import Filter from "@/components/rent/Filter";
import AnimateLayout from "@/components/AnimateLayout";
import UnderlineTabs from "@/components/common/UnderlineTabs";
import { sortArr } from "@/utils/countOccurrences";
import { navHeader } from "@/utils/path";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AnimateLayout className="w-full FlexParent">
      <Filter />

      <div className="w-full padding-body">
        <h1 className="font-bold text-3xl max-[720px]:text-center max-[420px]:text-[28px]">{navHeader[0].metaData.title}</h1>
        <UnderlineTabs tabs={sortArr} paramsValue="filter" className="mt-10" />

        {children}
      </div>
    </AnimateLayout>
  );
};

export default Layout;
