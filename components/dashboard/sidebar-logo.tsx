import { SidebarMenuButton } from "@/components/ui/sidebar";

export function SidebarLogo() {
  return (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <span className="text-lg font-bold">MP</span>
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">MyProPartner</span>
        <span className="truncate text-xs">ERP Artisan</span>
      </div>
    </SidebarMenuButton>
  );
}
