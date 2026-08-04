"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  BadgeAlert,
  Calendar,
  ChevronsUpDown,
  Circle,
  CircleCheck,
  Home,
  Inbox,
  ListTodo,
  LogOut,
  Logs,
  PanelLeft as PanelLeftIcon,
  Search,
  Settings,
  ShieldAlert,
  User2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./theme-toggle";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { requireUser } from "@/lib/api/auth";

// Menu items.
const platformItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Applications",
    url: "/dashboard/jobs",
    icon: ListTodo,
  },
  {
    title: "Logs",
    url: "/dashboard/logs",
    icon: Logs,
  },
];

const applicationItems = [
  {
    title: "In progress",
    url: "/",
    icon: BadgeAlert,
  },
  {
    title: "Applied",
    url: "/",
    icon: CircleCheck,
  },
  {
    title: "Drafts",
    url: "/",
    icon: ShieldAlert,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignout = () => {
    supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="pt-4 flex flex-row items-center justify-between px-3">
        <Image
          src={"/icons/watermark-logo-dark.svg"}
          alt="icon"
          width={140}
          height={48}
          className="block dark:hidden object-contain shrink-0 cursor-default"
          priority
        />
        <Image
          src={"/icons/watermark-logo-light.svg"}
          alt="icon"
          width={140}
          height={48}
          className="hidden dark:block object-contain shrink-0 cursor-default"
          priority
        />
        <ModeToggle />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-bold tracking-tighter text-md text-zinc-500">
            Platform
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <DashboardToggle />
              </SidebarMenuItem>
              {platformItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-bold tracking-tighter text-md text-zinc-500">
            Applications
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {applicationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="data-[state=open]:bg-accent p-4 py-8 ring-0 outline-none">
                  {/* image on left */}
                  {/* right side */}
                  {/* username */}
                  {/* email below username */}
                  <div className="flex flex-row gap-3 items-center">
                    {/* left side */}
                    <div>
                      {/* <Circle className="fill-blue-400 text-blue-400 w-12" size={24} /> */}
                    </div>
                    {/* right side */}
                    <div>
                      <p className="font-semibold">Username</p>
                      <p className="text-xs">username@email.com</p>
                    </div>
                  </div>

                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align={"center"}
                sideOffset={8}
                className="w-59 bg-white dark:bg-black text-gray-800 dark:text-gray-100 rounded-md shadow-md p-1 py-3 px-2 ring-0 animate-in fade-in slide-in-from-bottom-2 duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-bottom-2"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/settings/general"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-600/50 ring-0 outline-none"
                  >
                    <User2 className="w-4 h-4" />
                    <span>Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-600/50 ring-0 outline-none"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-600/50 ring-0 outline-none"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
                <DropdownMenuItem
                  onClick={() => handleSignout()}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 ring-0 outline-none cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function DashboardToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="flex items-center gap-2 w-full text-left px-2 py-2 rounded-md hover:bg-sidebar-accent cursor-pointer"
      aria-label="Toggle sidebar"
    >
      <PanelLeftIcon size={16} className="w-4 h-4 shrink-0" />
      <span className="text-sm font-medium group-data-[state=collapsed]:hidden">
        Dashboard
      </span>
    </button>
  );
}
