
import { Package, Users, TrendingUp, LayoutDashboard } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Products", url: "/products", icon: Package },
  { title: "Suppliers", url: "/suppliers", icon: Users },
  { title: "Transactions", url: "/transactions", icon: TrendingUp },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium hover:bg-primary/90" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-white border-r">
        <div className="p-4 border-b">
          <h2 className={`font-bold text-lg text-primary ${isCollapsed ? "hidden" : "block"}`}>
            Inventory Pro
          </h2>
          {isCollapsed && (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "hidden" : "block"}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
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
