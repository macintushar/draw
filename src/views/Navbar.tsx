import Profile from "@/components/Profile";
import { Link } from "@tanstack/react-router";

export default function Navbar() {
  return (
    <nav className="h-12 w-full grid grid-cols-3 p-1 px-3">
      <Link to="/pages" className="flex items-center">
        <h1 className="text-3xl font-bold">Draw</h1>
      </Link>

      <Link
        className="hover:font-bold flex justify-center items-center text-lg"
        to="/pages"
        activeProps={{ className: "font-bold" }}
      >
        <h1>Home</h1>
      </Link>
      <div className="flex justify-end">
        <Profile />
      </div>
    </nav>
  );
}
