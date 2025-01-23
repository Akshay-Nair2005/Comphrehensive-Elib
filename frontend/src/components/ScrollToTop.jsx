import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation(); // Gets the current route's path

  useEffect(() => {
    // Scroll to the top whenever pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // No visible UI, this component is purely functional
};

export default ScrollToTop;
