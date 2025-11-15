"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { getIcon } from "@/lib/navigation/utils/icon-map";
import type { ResolvedNavigation } from "@/lib/navigation/core/types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavigationMenuProps {
  navigation: ResolvedNavigation | null;
  isLoading: boolean;
}

export function NavigationMenu({ navigation, isLoading }: NavigationMenuProps) {
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {navigation?.items.map((item) => {
              const Icon = getIcon(item.icon);
              const hasSubItems = item.items && item.items.length > 0;

              return (
                <SidebarMenuItem key={item.key}>
                  {hasSubItems ? (
                    <Collapsible
                      defaultOpen={pathname.startsWith(item.href)}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={pathname.startsWith(item.href)}
                          tooltip={item.label}
                        >
                          <Icon />
                          <span>{item.label}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.key}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.href}
                              >
                                <Link href={subItem.href}>
                                  <span>{subItem.label}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {navigation?.quickActions && navigation.quickActions.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel>Création rapide</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.quickActions.map((action) => {
                const Icon = getIcon(action.icon);
                return (
                  <SidebarMenuItem key={action.key}>
                    <SidebarMenuButton asChild>
                      <Link href={action.href}>
                        <Icon className="size-4" />
                        <span>{action.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </>
  );
}
