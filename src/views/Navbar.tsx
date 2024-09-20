import ProfileDropdown from "@/components/ProfileDropdown";
import { Link } from "@tanstack/react-router";

export default function Navbar() {
  return (
    <nav className="grid h-12 w-full grid-cols-3 p-1 px-3">
      <Link to="/pages" className="flex items-center">
        <h1 className="font-virgil text-3xl font-bold">Draw</h1>
      </Link>
      <div className="flex flex-row justify-center space-x-3">
        <Link
          className="flex items-center justify-center text-lg hover:font-bold"
          to="/pages"
          activeProps={{ className: "font-bold" }}
        >
          <h1>Home</h1>
        </Link>
        <Link
          className="flex items-center justify-center text-lg hover:font-bold"
          to="/mermaid"
          activeProps={{ className: "font-bold" }}
        >
          <h1>Mermaid</h1>
        </Link>
      </div>
      <div className="flex justify-end">
        <ProfileDropdown />
      </div>
    </nav>
  );
}
