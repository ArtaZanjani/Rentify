import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import "swiper/css";
import ScrollLoad from "@/base/ScrollLoad";
import localFont from "next/font/local";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import Footer from "@/components/layout/Footer";
import { WishlistProvider } from "@/context/WishlistProvider";
import RefreshTokens from "@/base/RefreshTokens";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CompareProvider } from "@/context/CompareProvider";
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import { authenticate } from "@/utils/auth/authenticate";
import CompareSearch from "@/components/CompareSearch";
import MarginTop from "@/base/MarginTop";
import Alert from "@/components/Alert";

export const metadata: Metadata = {
  authors: [{ name: "Arta", url: "https://github.com/M7a1s" }],
  title: "رنتیفای",
  description: "پروژه رنتی فای یک پلتفرم پیشرفته است که تجربه ای حرفه ای و مطمئن از اجاره املاک را برای کاربران خود فراهم می آورد. با استفاده از رنتی فای شما می توانید به راحتی و با دقت بالا املاک را بر اساس نیازها و بودجه خود جست و جو کنید. این وبسایت با ارائه اطلاعات کامل و به روز از ویژگی‌ها، قیمت‌ها و موقعیت مکانی املاک، فرایند اجاره را ساده و شفاف میکند. همچنین سیستم فیلتر پیشرفته و امکان مقایسه به طور همزمان، به شما کمک می‌کند تا بهترین گزینه را بیابید.  علاوه بر این با افتخار اعلام میکنیم پروژه «رنتیفای» به طور کاملا رایگان در کامیونیتی فیگما منتشر شده است، با هدف ارائه ابزاری نوآورانه و بهینه برای ارتقاع تجربه طراحی و تسهیل فرایند همکاری در این پلتفرم",
  keywords: ["رنتیفای", "rentify"],
};

export const viewport: Viewport = {
  themeColor: "black",
  initialScale: 1.0,
  minimumScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: "cover",
};

const iranYekan = localFont({
  src: "../../public/fonts/IranYekan.woff",
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const result = await authenticate();

  return (
    <html lang="fa">
      <body dir="rtl" className={`${iranYekan.className} antialiased`}>
        <Alert />
        <RefreshTokens />
        <SidebarProvider>
          <Header isLogin={result.isLogin} role={result.user?.role ?? "USER"} />
          <SideBar role={result.user?.role ?? "USER"} />
        </SidebarProvider>
        {/* <DeleteLog /> */}
        <Toaster position="top-left" expand={false} richColors dir="rtl" />
        <ScrollLoad />

        <NextTopLoader color="var(--color-primary)" initialPosition={0.08} crawlSpeed={200} height={3} crawl showSpinner={false} easing="ease" speed={200} shadow="0 0 10px var(--color-primary),0 0 5px var(--color-primary)" zIndex={1600} showAtBottom={false} />
        <CompareProvider>
          <WishlistProvider>
            <CompareSearch />
            <MarginTop />
            <main className="w-full FlexParent">{children}</main>
          </WishlistProvider>
        </CompareProvider>

        <Footer />
      </body>
    </html>
  );
}
