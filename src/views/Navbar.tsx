import ProfileDropdown from "@/components/ProfileDropdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { LucideIcon } from "lucide-react";

type NavButtonProps = {
  isActive: boolean;
  label: string;
  icon?: LucideIcon;
};

function NavButton({ isActive, label, icon: Icon }: NavButtonProps) {
  return (
    <Button
      className={cn(
        "flex h-9 items-center justify-center gap-2 px-4 text-sm font-medium transition-all",
        isActive
          ? "font-semibold text-gray-900 dark:text-gray-50"
          : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
      )}
      variant="ghost"
    >
      {Icon && <Icon className="h-4 w-4" />} {label}
    </Button>
  );
}

const routes = [
  {
    label: "Home",
    to: "/pages",
  },
  {
    label: "Mermaid",
    to: "/mermaid",
  },
];

export default function Navbar() {
  return (
    <nav className="flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-950">
      <Link to="/pages" className="flex items-center">
        <h1 className="font-virgil text-2xl font-bold text-gray-900 dark:text-gray-50">Draw</h1>
      </Link>
      <div className="flex flex-row items-center gap-1">
        {routes.map(({ label, to }) => (
          <Link to={to} key={to}>
            {({ isActive }) => {
              return <NavButton label={label} isActive={isActive} />;
            }}
          </Link>
        ))}
      </div>
      <ProfileDropdown />
    </nav>
  );
}
