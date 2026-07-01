"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 pt-3`}
    >
      <nav className="transition-all duration-500">
        <div className="mx-auto max-w-6xl px-6 md:px-2 py-4">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center justify-center gap-4 transition-all duration-300  ${
                scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              {/* logo */}
              <Image
                src="/icons/watermark-logo-light.svg"
                alt="icon"
                width={140}
                height={48}
                className="object-contain shrink-0 cursor-default"
                priority
              />

              {/* nav */}
              <ul
                className={`hidden md:flex items-center space-x-6 text-sm text-white `}
              >
                <li className="hover:text-white transition cursor-pointer">
                  Service
                </li>
                <li className="hover:text-white transition cursor-pointer">
                  Purpose
                </li>
                <li className="hover:text-white transition cursor-pointer">
                  FAQ
                </li>
              </ul>
            </div>

            {/* CTA */}
            <Link href={"/auth/register"}>
              <Button
                variant={`${scrolled ? "default" : "ghost"}`}
                className="flex items-center text-white font-bold px-5 py-5 text-lg cursor-pointer transition-colors duration-200"
              >
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
                    scrolled ? "max-w-25 opacity-100 mr-2" : "max-w-0 opacity-0 mr-0"
                  } md:max-w-25 md:opacity-100 md:mr-2`}
                >
                  Register
                </span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
