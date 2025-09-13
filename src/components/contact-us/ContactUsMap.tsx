"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
});

const ContactUsMap = () => {
  return (
    <div className="w-full aspect-video max-h-94.5 bg-g9 rounded-2xl overflow-hidden mt-14">
      <Map />
    </div>
  );
};

export default ContactUsMap;
