import "../../styles/admin/TopbarMitra.css";
import { Search, ChevronDown } from 'lucide-react'

// test perubahan
export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Global search for talents, partners, or meetings..."
        />
      </div>

            <div className="topbar-search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Global search for talents, partners, or meetings..."
        />
      </div>
    </header>
  )
}
