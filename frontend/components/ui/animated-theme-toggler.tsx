"use client";

import { useEffect, useMemo, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  showLabel?: boolean;
  /** Render as a DropdownMenuItem with matching icon + label style */
  asMenuItem?: boolean;
}

export const AnimatedThemeToggler = ({
  className,
  showLabel = false,
  asMenuItem = false,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = useMemo(() => resolvedTheme === "dark", [resolvedTheme]);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(isDark ? "light" : "dark");
  };

  const currentIsDark = mounted ? isDark : false;

  // ── Render as a DropdownMenuItem ───────────────────────────────────────
  // Uses DropdownMenuItem's own styling, just like Settings / Keyboard rows.
  // We pass onClick down and use asChild pattern via onSelect to prevent
  // the dropdown from closing (theme toggle should keep menu open).
  if (asMenuItem) {
    return (
      <DropdownMenuItem
        onSelect={(e) => {
          // Prevent dropdown from auto-closing on select
          e.preventDefault();
          toggleTheme();
        }}
        className="gap-2.5 py-2 cursor-pointer"
      >
        <span className="text-neutral-500 dark:text-neutral-400 shrink-0 flex items-center">
          {currentIsDark ? <Sun size={14} /> : <Moon size={14} />}
        </span>
        <span className="text-[12px]">
          {currentIsDark ? "Light mode" : "Dark mode"}
        </span>
      </DropdownMenuItem>
    );
  }

  // ── Standalone button ──────────────────────────────────────────────────
  return (
    <button
      onClick={toggleTheme}
      className={cn(
        showLabel && "flex cursor-pointer items-center gap-2 w-full",
        className,
      )}
      {...props}
    >
      {currentIsDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {showLabel && (
        <span className="text-sm">
          {currentIsDark ? "Light mode" : "Dark mode"}
        </span>
      )}
      {!showLabel && <span className="sr-only">Toggle theme</span>}
    </button>
  );
};
