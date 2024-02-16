"use client";
import { BellIcon, ChevronLeft, VenetianMask } from "lucide-react";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMenuStore } from "@/store/useMenuStore";
import Head from "next/head";

interface HeaderProps {
  actionButton?: React.ReactNode;
}

export default function Header({ actionButton }: HeaderProps) {
  const pathName = usePathname();
  const { pageTitle } = useMenuStore();
  const setPageTitle = useMenuStore((state) => state.setPageTitle);

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (pathName.includes("conversation")) {
      setPageTitle("Carregando...");
    }
  }, [pathName, setPageTitle]);

  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-full items-center gap-2 justify-start px-4 sm:px-6 lg:px-8">
        <img
          className="h-8 w-auto hidden lg:block"
          src="https://privatus.vip/assets/img/splash/logo.png"
          alt="Your Company"
        />
        <div className="w-full lg:hidden flex gap-2 justify-start">
          {pathName !== "/" ? (
            <>
              <Button
                className="px-0 w-8 h-8"
                variant={"ghost"}
                onClick={handleBack}
              >
                <ChevronLeft />
              </Button>
              <div className="flex items-center gap-x-8 font-semibold">
                {pageTitle}
              </div>
            </>
          ) : (
            <img
              className="h-8 w-auto"
              src="https://privatus.vip/assets/img/splash/logo.png"
              alt="Your Company"
            />
          )}
        </div>
      </div>
    </header>
  );
}
