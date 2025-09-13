import UnderlineTabs from "@/components/common/UnderlineTabs";
import HomeShow_Loading from "@/components/shared/HomesShow/HomeShow_Loading";
import { sortArr } from "@/utils/countOccurrences";

const Loading = () => {
  return (
    <>
      <div className="w-33 h-9 bg-g9 rounded-md animate-pulse"></div>

      <UnderlineTabs tabs={sortArr} paramsValue="sort" className="mt-10" />

      <HomeShow_Loading />
    </>
  );
};

export default Loading;
