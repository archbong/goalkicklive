"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Settings } from "lucide-react";

export function Header() {
  return (
    <header className="w-full bg-black text-white px-4 py-3 flex items-center justify-between">
      {/* Logo / Title */}
      <Link href="/" className="text-lg font-semibold tracking-wide">
        Football Highlight
      </Link>

      {/* Settings Button */}
      <Link href="/settings">
        <Button size="icon" variant="ghost" className="text-white hover:bg-gray-800">
          <Settings className="h-5 w-5" />
        </Button>
      </Link>
    </header>
  );
}
