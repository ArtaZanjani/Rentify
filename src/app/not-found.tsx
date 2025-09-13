import ErrorUi from "@/components/ErrorUi";
import { Messages } from "@/utils/messages";

const NotFound = () => {
  return <ErrorUi title={Messages["404"].title} description={Messages["404"].description} btn={{ label: Messages["404"].btnLabel, action: { path: "/", navigate: "replace" } }} img={{ src: "/images/illustrations/404.png", alt: "404" }} className="mt-16" />;
};

export default NotFound;
