"use client";

import { FunctionComponent, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowUpCircle } from "lucide-react";

const SCROLL_TRESHOLD = 250;

const ScrollToTop: FunctionComponent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = document.documentElement.scrollTop;
      setIsVisible(scrolled > SCROLL_TRESHOLD);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return isVisible && <Button
      onClick={() => scrollToTop()}
      className="fixed w-10 p-0 rounded-full right-4 bottom-20 md:bottom-4 opacity-40"
    >
      <ArrowUpCircle />
    </Button>;
};

export default ScrollToTop;
