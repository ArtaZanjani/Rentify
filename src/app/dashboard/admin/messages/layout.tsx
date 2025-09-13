import AnimateLayout from "@/components/AnimateLayout";
import { path_admin } from "@/utils/path";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <AnimateLayout heading={path_admin[3].metaData.title}>{children}</AnimateLayout>;
};

export default Layout;
