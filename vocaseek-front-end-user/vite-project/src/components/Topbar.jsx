import "../styles/Topbar.css";
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

      <div className="topbar-user">
        <div className="topbar-user-info">
          <div className="topbar-user-name">Bank Mandiri</div>
          <div className="topbar-user-role">ENTERPRISE ACCOUNT</div>
        </div>
        <ChevronDown size={16} />
      </div>
    </header>
  )
}