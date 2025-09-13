import DashboardSideBar from "@/components/dashboard/DashboardSideBar";
import { authenticate } from "@/utils/auth/authenticate";
import { redirect } from "next/navigation";
import type { UserType } from "@/types/types";
import { AuthProvider } from "@/context/AuthProvider";
import CheckRole from "@/components/dashboard/shared/CheckRole";
import { path_user, path_admin } from "@/utils/path";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const result = await authenticate();

  if (!result.isLogin) {
    redirect("/auth/owner");
  }

  const parsedData: UserType = JSON.parse(JSON.stringify(result.user));

  return (
    <AuthProvider user={parsedData}>
      <CheckRole />
      <div className="flex w-full padding-body max-md:flex-col gap-18">
        <DashboardSideBar userData={parsedData} path={parsedData.role !== "ADMIN" ? path_user : path_admin} />

        {children}
      </div>
    </AuthProvider>
  );
};

export default layout;
