import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/fa";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

// اول زبان رو فارسی ست کن
dayjs.locale("fa");

// بعد override کنیم
dayjs.updateLocale("fa", {
  relativeTime: {
    future: "%s دیگر", // مثلا: "۴ ماه دیگر"
    past: "%s پیش", // مثلا: "۲ روز پیش"
    s: "چند لحظه",
    m: "۱ دقیقه",
    mm: "%d دقیقه",
    h: "۱ ساعت",
    hh: "%d ساعت",
    d: "۱ روز",
    dd: "%d روز",
    M: "۱ ماه",
    MM: "%d ماه",
    y: "۱ سال",
    yy: "%d سال",
  },
});

export const formatBanTime = (banTime?: string | Date, isBanned?: boolean): string => {
  if (isBanned) return "بن دائمی";
  if (!banTime) return "بن فعال نیست";

  const end = dayjs(banTime);
  if (!end.isValid()) return "تاریخ نامعتبر";

  if (end.isBefore(dayjs())) {
    return "بن تمام شده";
  }

  return end.fromNow();
};

export default dayjs;
