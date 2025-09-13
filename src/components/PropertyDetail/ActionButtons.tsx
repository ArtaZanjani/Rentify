"use client";
import { Heart } from "iconsax-react";
import { WishlistContext } from "@/context/WishlistProvider";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type ActionButtonsPropsType = { isLoading: true; id?: string; message?: string } | { isLoading: false; id: string; message: string };

const ActionButtons = ({ id, message, isLoading }: ActionButtonsPropsType) => {
  const [openState, setOpenState] = useState<boolean>(false);
  const wishList = useContext(WishlistContext);

  useEffect(() => {
    setOpenState(true);
  }, []);

  if (!openState) {
    return null;
  }

  const handleNavigate = async () => {
    const shareData = {
      title: "رنتیفای",
      text: message,
      url: `${process.env.NEXT_PUBLIC_MAIN_URL}/property-detail/${id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        toast.error("امکان اشتراک‌گذاری این محتوا در حال حاضر وجود ندارد.");
      }
    } else {
      toast.error("اشتراک‌گذاری در این مرورگر پشتیبانی نمی‌شود.");
    }
  };

  return (
    <div className="flex items-center gap-x-4 max-[550px]:mr-auto">
      <button aria-label="اشتراک گزاشتن" onClick={() => (isLoading ? null : handleNavigate())}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={isLoading ? "var(--color-g9)" : "var(--color-black)"}>
          <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm480-280q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720Zm0 520ZM200-480Zm480-280Z" />
        </svg>
      </button>
      <button aria-label={isLoading ? "افزودن به علاقه مندی" : wishList?.wishlist.includes(id) ? "حذف از علاقه مندی" : "افزودن به علاقه مندی"} onClick={() => (isLoading ? null : wishList?.toggleWishlist(id))}>
        <Heart className="size-7" color={isLoading ? "var(--color-g9)" : "var(--color-states-error1)"} variant={isLoading ? "Linear" : wishList?.wishlist.includes(id) ? "Bold" : "Linear"} />
      </button>
    </div>
  );
};

export default ActionButtons;
