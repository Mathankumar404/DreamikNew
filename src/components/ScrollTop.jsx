import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation(); // Get current route

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top smoothly
  }, [pathname]); // Trigger effect on route change

  return null; // No visible output
};

export default ScrollToTop;
