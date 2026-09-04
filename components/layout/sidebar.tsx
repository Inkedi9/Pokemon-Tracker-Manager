"use client";

import Link from "next/link";
import { BarChart3, TrendingUp, Library, Package } from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/",
    icon: BarChart3,
  },
  {
    label: "Collection",
    href: "/collection",
    icon: Library,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: TrendingUp,
  },
];

export function Sidebar() {
  return (
    <aside className="fixed top-16 bottom-0 left-0 w-60 border-r border-white/10 bg-[#0c0c0f] p-4">
      <div className="mb-6">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
          Navigation
        </p>
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <Icon className="h-4 w-4" />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
          Stock
        </p>

        <div className="mt-2">
          <Link
            href="/collection"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            <Package className="h-4 w-4" />
            <span>Mes cartes</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}