import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@workspace/ui/components/command";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import React from "react";
import { Iconify } from "@/components/iconify";
import { useTheme } from "@/theme/context";
import { sidebarData } from "../../data/sidebar-data";
import { useSearch } from "./context";

export function CommandMenu() {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { open, setOpen } = useSearch();

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen],
  );

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <ScrollArea type="hover" className="h-72 pr-1">
          <CommandEmpty>No results found.</CommandEmpty>
          {sidebarData.navGroups.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem, navItemIndex) => {
                if (navItem.url)
                  return (
                    <CommandItem
                      key={`${navItem.url}-${navItemIndex}`}
                      value={navItem.title}
                      onSelect={() => {
                        runCommand(() => navigate({ to: navItem.url }));
                      }}
                    >
                      <div className="mr-2 flex h-4 w-4 items-center justify-center">
                        <Iconify
                          icon="tabler:arrow-right-dashed"
                          className="size-2 text-muted-foreground/80"
                        />
                      </div>
                      {navItem.title}
                    </CommandItem>
                  );

                return navItem.items?.map((subItem, subItemIndex) => (
                  <CommandItem
                    key={`${subItem.url}-${subItemIndex}`}
                    value={subItem.title}
                    onSelect={() => {
                      runCommand(() => navigate({ to: subItem.url }));
                    }}
                  >
                    <div className="mr-2 flex h-4 w-4 items-center justify-center">
                      <Iconify
                        icon="tabler:arrow-right-dashed"
                        className="size-2 text-muted-foreground/80"
                      />
                    </div>
                    {subItem.title}
                  </CommandItem>
                ));
              })}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Iconify icon="tabler:sun" /> <span>Light</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Iconify icon="tabler:moon" className="scale-90" />
              <span>Dark</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Iconify icon="tabler:device-laptop" />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
}
