"use client";

import * as React from "react";
import {
  BellIcon,
  CalculatorIcon,
  CalendarIcon,
  ClipboardPasteIcon,
  CodeIcon,
  CopyIcon,
  CreditCardIcon,
  FileTextIcon,
  FolderIcon,
  FolderPlusIcon,
  HelpCircleIcon,
  HomeIcon,
  ImageIcon,
  InboxIcon,
  LayoutGridIcon,
  ListIcon,
  LogOut,
  MailPlusIcon,
  Moon,
  PlusIcon,
  ScissorsIcon,
  SettingsIcon,
  Sun,
  TrashIcon,
  UserIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export function GlobalCommandPalette() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;

      const isCmdK =
        event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);

      if (isCmdK) {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => router.push("/dashboard/")}>
                <HomeIcon />
                <span>Home</span>
                <CommandShortcut>⌘H</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => router.push("/dashboard/jobs")}>
                <InboxIcon />
                <span>Applications</span>
                <CommandShortcut>⌘A</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <FileTextIcon />
                <span>Kanban</span>
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <FolderIcon />
                <span>Scan logs</span>
                <CommandShortcut>⌘F</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem>
                <PlusIcon />
                <span>New Application</span>
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <MailPlusIcon />
                <span>Draft Email</span>
                <CommandShortcut>⌘M</CommandShortcut>
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  theme === "dark" ? setTheme("light") : setTheme("dark")
                }
              >
                {theme === "dark" ? <Sun /> : <Moon />}
                <span>Toggle theme</span>
                <CommandShortcut>⌘M</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <LogOut />
                <span>Sign out</span>
                <CommandShortcut>⌘L</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Account">
              <CommandItem>
                <UserIcon />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <SettingsIcon />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <BellIcon />
                <span>Notifications</span>
              </CommandItem>
              <CommandItem>
                <HelpCircleIcon />
                <span>Help & Support</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
