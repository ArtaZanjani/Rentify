import Button from "@/components/common/Button";

const Success = () => {
  return (
    <div className="flex-1 flex items-center justify-center gap-y-4 flex-col">
      <div className="size-30 rounded-full bg-primary flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="size-full" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--color-white)">
          <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
        </svg>
      </div>

      <p className="text-h5">آگهی شما با موفقیت ثبت شد</p>

      <Button href="/dashboard/user/my-ads" width="w-fit" height="h-12" variant="fill">
        مشاهده وضعیت
      </Button>
    </div>
  );
};

export default Success;
