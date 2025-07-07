export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showSidebar?: boolean;
  className?: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  isActive?: boolean;
}

export interface UserSession {
  user: any;
  userSession: string | null;
  isLoading: boolean;
}

export type FoodItem = {
  id: string | number;
  title: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  isVeg: boolean;
};
