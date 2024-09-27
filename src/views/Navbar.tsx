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
        "flex h-10 w-full items-center justify-center gap-3 text-sm font-light hover:font-bold",
        isActive ? "font-bold" : "font-medium",
      )}
      variant="outline"
    >
      {Icon && <Icon />} {label}
    </Button>
  );
}

export default function Navbar() {
  return (
    <nav className="grid h-12 w-full grid-cols-3 p-1 px-3">
      <Link to="/pages" className="flex items-center">
        <h1 className="font-virgil text-3xl font-bold">Draw</h1>
      </Link>
      <div className="font-quicksand flex flex-row items-center justify-center space-x-3">
        <Link to="/pages" className="w-24">
          {({ isActive }) => {
            return <NavButton label="Home" isActive={isActive} />;
          }}
        </Link>
        <Link to="/mermaid" className="w-24">
          {({ isActive }) => {
            return <NavButton label="Mermaid" isActive={isActive} />;
          }}
        </Link>
      </div>
      <div className="flex justify-end">
        <ProfileDropdown />
      </div>
    </nav>
  );
}
