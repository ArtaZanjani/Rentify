import Image from "next/image";
import { navFooter, navHeader } from "@/utils/path";
import { Clock } from "iconsax-react";
import ContactUsMap from "@/components/contact-us/ContactUsMap";
import ContactUsForm from "@/components/contact-us/ContactUsForm";
import { authenticate } from "@/utils/auth/authenticate";
import type { authenticateType } from "@/types/types";
import AnimateLayout from "@/components/AnimateLayout";
import { Metadata } from "next";

export const metadata: Metadata = navHeader[3].metaData;

const Information = [
  {
    label: "ایمیل",
    value: navFooter[3].list[0].label,
    icon: navFooter[3].list[0].icon,
  },
  {
    label: "ساعت کاری ",
    value: "از ۸ صبح الی ۸ شب آماده خدمات رسانی به شما هستیم",
    icon: Clock,
  },
  {
    label: "آدرس",
    value: navFooter[3].list[2].label,
    icon: navFooter[3].list[2].icon,
  },
];

const ContactUs = async () => {
  const result = await authenticate();

  const parsedData: authenticateType = JSON.parse(JSON.stringify(result));

  return (
    <AnimateLayout className="w-full padding-body">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-h3">{navHeader[3].metaData.title}</h1>
        <p className="text-sm max-[475px]:font-medium min-[475px]:text-xl text-shade-2 mt-2">ما از اینکه شما را در جمع خود داریم بسیار خوشحالیم :{")"}</p>
      </div>

      <div className="w-full flex justify-center min-[980px]:justify-between mt-10 gap-x-12">
        <ContactUsForm name={parsedData?.user?.name ?? ""} last_name={parsedData?.user?.last_name ?? ""} phone_number={parsedData?.user?.phone_number ?? ""} />

        <div className="w-[496px] max-h-[493px] relative rounded-2xl overflow-hidden max-[980px]:hidden">
          <Image src="/images/hand.png" alt={navHeader[3].metaData.title} fill sizes="100%" priority quality={100} className="object-cover" />
        </div>
      </div>

      <div className="w-full flex justify-center min-[1264px]:justify-between items-center flex-wrap gap-6 mt-14">
        {Information.map((e, index) => (
          <div className="w-98 md:h-62 py-5 bg-white rounded-2xl flex flex-col items-center justify-center" key={index}>
            <div className="size-20 bg-g1 rounded-full flex items-center justify-center">{e.icon && <e.icon className="size-10 stroke-white" />}</div>

            <h2 className="text-h6 mt-6">{e.label}</h2>

            <p className="text-sm text-g5 mt-1 w-47 text-center">{e.value}</p>
          </div>
        ))}
      </div>

      <ContactUsMap />
    </AnimateLayout>
  );
};

export default ContactUs;
