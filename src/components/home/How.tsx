import SectionBase from "../common/SectionBase";
import { SearchNormal1, CalendarTick, Eye } from "iconsax-react";
import { Fragment } from "react";

const steps = [
  {
    step: "1",
    icon: <SearchNormal1 className="!size-12.5 stroke-white" />,
    title: "جستجو",
    description: (
      <>
        ملک مورد علاقه‌‌ی خود را <br /> پیدا کنید
      </>
    ),
  },
  {
    step: "2",
    icon: <CalendarTick className="!size-12.5 stroke-white" />,
    title: "برنامه بازدید",
    description: (
      <>
        زمان خود را برای بازدید از ملکتان <br /> مشخص کنید
      </>
    ),
  },
  {
    step: "3",
    icon: <Eye className="!size-12.5 stroke-white" />,
    title: "بازدید از ملک",
    description: (
      <>
        ملک خود را در زمان مشخص کرده <br /> بازدید کنید
      </>
    ),
  },
  {
    step: "4",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="50px" width="50px" viewBox="0 -960 960 960" fill="var(--color-white)">
        <path d="M535-87q11 3 25.5 2.5T585-89l295-111q0-34-24-57t-56-23H526q-3 0-7-.5t-6-1.5l-59-21q-8-3-11-10t-1-15q2-7 10-11t16-1l45 17q4 2 6.5 2.5t7.5.5h105q19 0 33.5-13t14.5-34q0-14-8.5-27T649-412L372-515q-7-2-14-3.5t-14-1.5h-64v361l255 72ZM40-160q0 33 23.5 56.5T120-80q33 0 56.5-23.5T200-160v-280q0-33-23.5-56.5T120-520q-33 0-56.5 23.5T40-440v280Zm600-312q-15 0-29.5-5.5T584-494L474-602q-31-30-52.5-66.5T400-748q0-55 38.5-93.5T532-880q32 0 60 13.5t48 36.5q20-23 48-36.5t60-13.5q55 0 93.5 38.5T880-748q0 43-21 79.5T807-602L696-494q-12 11-26.5 16.5T640-472Z" />
      </svg>
    ),
    title: "نهایی کردن معامله",
    description: (
      <>
        به کمک مشاورین املاک ما <br /> معامله‌ی خود را نهایی کنید
      </>
    ),
  },
];

const How = () => {
  const firstGroup = steps.slice(0, 2);
  const secondGroup = steps.slice(2);

  const renderGroup = (group: typeof steps) => (
    <div className="flex items-center gap-x-6 max-[1200px]:w-full min-[1200px]:flex-1">
      {group.map((e, index) => (
        <Fragment key={e.step}>
          <div className="flex flex-col items-center flex-1">
            <div className="size-24 min-[540px]:size-28 rounded-full bg-g1 flex justify-center items-center relative">
              {e.icon}

              <div className="absolute flex items-center justify-center text-white border border-white rounded-full size-9 bg-shade-2 -left-4">{e.step}</div>
            </div>

            <p className="mt-3 text-xl text-black xs:text-2xl">{e.title}</p>
            <p className="mt-1 text-xs font-medium text-center text-g3">{e.description}</p>
          </div>

          {index !== group.length - 1 && <div className="w-30.5 h-0.5 bg-g9 max-[540px]:hidden"></div>}
        </Fragment>
      ))}
    </div>
  );

  return (
    <SectionBase title="رنتی‌فای چه طور کار می کند؟" element="h4" href={null}>
      <div className="w-full max-[1200px]:flex-col flex gap-6 items-center justify-between">
        {renderGroup(firstGroup)}
        <div className="w-30.5 h-0.5 bg-g9 max-[1200px]:hidden"></div>
        {renderGroup(secondGroup)}
      </div>
    </SectionBase>
  );
};

export default How;
