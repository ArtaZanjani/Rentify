import connectToDB from "@/configs/connectToDB";
import type { Metadata } from "next";
import UserModel from "@/models/UserModel";
import AdminTable from "@/components/dashboard/admin/AdminTable";
import { path_admin } from "@/utils/path";

export const metadata: Metadata = path_admin[1].metaData;

export const dynamic = "force-dynamic";
const UsersList = async () => {
  await connectToDB();
  const users = await UserModel.find({}, "name last_name phone_number role isBanned banTime").sort({ _id: -1 });

  return <AdminTable users={JSON.parse(JSON.stringify(users))} />;
};

export default UsersList;
