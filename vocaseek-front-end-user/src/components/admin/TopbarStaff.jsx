import { Search } from "lucide-react";

export default function TopbarStaff() {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Global search for talents, partners, or meetings..."
        />
      </div>

      <div className="topbar-profile" />
    </header>
  );
}