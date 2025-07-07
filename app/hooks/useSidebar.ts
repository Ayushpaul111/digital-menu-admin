import { useState, useCallback, useEffect } from "react";

export const useSidebar = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  // Auto-open on desktop, closed on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Desktop: sidebar should be visible
        setIsOpen(true);
      } else {
        // Mobile: sidebar should be closed by default
        setIsOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Listen for window resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    toggle,
    open,
    close,
    setIsOpen,
  };
};
