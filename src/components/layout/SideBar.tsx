"use client";
import { navHeader } from "@/utils/path";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { roleTypes } from "@/types/types";

export default function SideBar({ role }: { role: roleTypes }) {
  const pathname = usePathname();
  const { openMobile, setOpenMobile, isMobile } = useSidebar();

  useEffect(() => {
    if (!openMobile) return;

    setOpenMobile(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, setOpenMobile]);

  if (typeof window === "undefined" || !isMobile) return null;

  return (
    <Sidebar side="right" variant="sidebar" collapsible="offcanvas">
      <SidebarContent className="bg-white">
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {navHeader
                .filter((e) => e.path !== navHeader[4].path || role !== "ADMIN")
                .map((e) => (
                  <SidebarMenuItem key={e.metaData.title}>
                    <SidebarMenuButton asChild>
                      <Link href={e.path} className="h-12 pr-0">
                        <div className={`h-full bg-primary duration-200 rounded-l-full ${pathname === e.path ? "w-2" : "w-0"}`}></div>
                        <e.icon className="!size-6" color="var(--color-primary)" variant={pathname === e.path ? "Bold" : "Linear"} />
                        <span className="text-base font-medium">{e.metaData.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
