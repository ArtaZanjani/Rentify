import AnimateLayout from "@/components/AnimateLayout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <AnimateLayout className="w-full padding-body flex flex-col">{children}</AnimateLayout>;
};

export default Layout;
