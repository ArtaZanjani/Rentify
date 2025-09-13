"use client";

import { useActionState, useEffect, useState } from "react";
import { editStatus } from "@/actions/newHome";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AdminStatus = ({ homeId }: { homeId: string }) => {
  const [stateCode, formActionCode] = useActionState(editStatus, {
    message: "",
    error: false,
  });
  const { refresh, push } = useRouter();

  useEffect(() => {
    if (stateCode.message.length) {
      if (stateCode.error) {
        toast.error(stateCode.message);
      } else {
        refresh();
        push("/dashboard/admin/pending-ads");
        toast.success(stateCode.message);
      }
    }
  }, [stateCode, refresh, push]);

  const [status, setStatus] = useState<"active" | "rejected" | null>(null);
  return (
    <form className="space-x-3" action={formActionCode}>
      <button onMouseEnter={() => setStatus("active")} onMouseLeave={() => setStatus(null)} className="h-12 border text-states-success1 hover:bg-states-success1 hover:text-white rounded-lg px-4">
        تأیید آگهی
      </button>
      <button onMouseEnter={() => setStatus("rejected")} onMouseLeave={() => setStatus(null)} className="h-12 border text-states-error1 hover:bg-states-error1 hover:text-white rounded-lg px-4">
        رد آگهی
      </button>

      <input type="hidden" name="homeId" value={homeId} />
      <input type="hidden" name="status" value={status ?? ""} />
    </form>
  );
};

export default AdminStatus;
