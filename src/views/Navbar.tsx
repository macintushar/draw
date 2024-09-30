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
    <nav className="grid h-12 w-full grid-cols-3 p-1 px-3">
      <div>
        <Link to="/pages" className="flex w-fit items-center">
          <h1 className="font-virgil text-3xl font-bold">Draw</h1>
        </Link>
      </div>
      <div className="flex flex-row items-center justify-center space-x-3 font-quicksand">
        {routes.map(({ label, to }) => (
          <Link to={to} key={to} className="w-24">
            {({ isActive }) => {
              return <NavButton label={label} isActive={isActive} />;
            }}
          </Link>
        ))}
      </div>
      <div className="flex justify-end">
        <ProfileDropdown />
      </div>
    </nav>
  );
}
