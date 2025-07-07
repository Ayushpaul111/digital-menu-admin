import { createContext, useContext, ReactNode } from "react";
import { useSidebar } from "../hooks/useSidebar";

interface LayoutContextType {
  sidebar: ReturnType<typeof useSidebar>;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const sidebar = useSidebar();

  return (
    <LayoutContext.Provider value={{ sidebar }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
