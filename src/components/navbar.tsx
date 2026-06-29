"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 pt-3`}>
      <nav className="transition-all duration-500">
        <div className="mx-auto max-w-6xl px-6 md:px-2 py-4">
          <div className="flex items-center justify-between">

            {/* logo */}
            <h1
              className={`font-bold tracking-tighter text-2xl cursor-pointer duration-300 ease-in-out transition-all ${
                scrolled ? "opacity-0 pointer-events-none" : "text-black opacity-100"
              }`}
            >
              Trackly.
            </h1>

            {/* nav */}
            <ul
              className={`hidden md:flex items-center space-x-6 text-sm text-zinc-500 transition-all duration-300 ${
                scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <li className="hover:text-white transition cursor-pointer">Home</li>
              <li className="hover:text-white transition cursor-pointer">Service</li>
              <li className="hover:text-white transition cursor-pointer">Purpose</li>
              <li className="hover:text-white transition cursor-pointer">FAQ</li>
            </ul>

            {/* CTA */}
            <Link href={'/auth/register'}>
              <Button variant={`${scrolled ? "default" : "ghost"}`} className="gap-2 text-lg">
                Register
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;