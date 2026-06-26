import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToTopProps {
  currentTab?: string;
}

export function ScrollToTop({ currentTab }: ScrollToTopProps) {
  const { pathname, state } = useLocation();

  useEffect(() => {
    // Scroll to the absolute top of the page on route change or when active tab changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });
  }, [pathname, state, currentTab]);

  return null;
}

