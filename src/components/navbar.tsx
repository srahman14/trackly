"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "px-12 pt-4" : "px-0 pt-0"}`}>
      <nav
        className={`transition-all duration-500 border-transparent ${
          scrolled
            ? "bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg shadow-black/5 rounded-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">

            {/* logo */}
            <h1 className="font-bold tracking-tighter text-2xl cursor-pointer">
              Trackly.
            </h1>

            {/* nav */}
            <ul className="hidden md:flex items-center space-x-6 text-sm text-zinc-500">
              <li className="hover:text-black transition cursor-pointer">Home</li>
              <li className="hover:text-black transition cursor-pointer">Service</li>
              <li className="hover:text-black transition cursor-pointer">Purpose</li>
              <li className="hover:text-black transition cursor-pointer">FAQ</li>
            </ul>

            {/* CTA */}
            <Button variant="ghost" className="gap-2">
              Register
              <ArrowUpRight className="w-4 h-4" />
            </Button>

          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;