import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, LayoutDashboard, Link2, Megaphone, SlidersHorizontal, TicketPercent, Download } from "lucide-react";

const nav = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "products", label: "Produk", icon: Link2 },
  { key: "campaigns", label: "Kampanye", icon: Megaphone },
  { key: "utm", label: "UTM Builder", icon: SlidersHorizontal },
  { key: "coupons", label: "Kupon", icon: TicketPercent },
  { key: "exports", label: "Ekspor", icon: Download },
];

export default function Sidebar({ active, onChange }) {
  const loc = useLocation();
  const Item = ({ item }) => {
    const Icon = item.icon;
    const isActive = active === item.key;
    return (
      <button
        onClick={() => onChange(item.key)}
        className={`flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm transition-colors
          ${isActive ? "bg-teal-600 text-white" : "hover:bg-stone-100 text-stone-700"}`}
      >
        <Icon size={18} />
        <span>{item.label}</span>
      </button>
    );
  };

  const SidebarInner = () => (
    <div className="h-full flex flex-col gap-4 p-3">
      <div className="px-2 pt-2">
        <Link to="/" className="font-semibold text-stone-800">
          AffiPro<span className="text-teal-700">.SEO</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1">
        {nav.map(n => (
          <Item key={n.key} item={n} />
        ))}
      </nav>
      <div className="text-xs text-stone-500 px-2 pb-2">v0.1 mock</div>
    </div>
  );

  return (
    <>
      <div className="hidden md:flex md:w-60 md:shrink-0 border-r bg-white">
        <SidebarInner />
      </div>
      <div className="md:hidden p-2 border-b sticky top-0 bg-white z-40">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-semibold text-stone-800">
            AffiPro<span className="text-teal-700">.SEO</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white" size="sm">
                <Menu size={16} />
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SidebarInner />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}

export const sidebarNav = nav;