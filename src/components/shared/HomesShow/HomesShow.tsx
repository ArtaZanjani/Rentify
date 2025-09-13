import LimitBtn from "@/components/common/LimitBtn";
import HomeCard from "@/components/common/HomeCard";
import { HomeType } from "@/types/types";

type HomesShowPropsType = {
  parsedData: HomeType[];
  limit: number;
  totalHomesCount: number;
  label: string;
};

const HomesShow = ({ parsedData, limit, totalHomesCount, label }: HomesShowPropsType) => {
  return (
    <div className="flex flex-col w-full mt-7">
      <div className={`w-full grid grid-cols-[repeat(auto-fit,minmax(320px,auto))] justify-center ${parsedData.length >= 4 ? "min-[720px]:justify-between" : "min-[720px]:justify-start"} gap-10`}>
        {parsedData.map((e) => (
          <HomeCard key={String(e._id)} {...e} />
        ))}
      </div>

      {limit < totalHomesCount && <LimitBtn limit={limit} label={label} />}
    </div>
  );
};

export default HomesShow;
