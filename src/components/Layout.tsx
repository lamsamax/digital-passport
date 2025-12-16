import { ReactNode, useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileCheck,
  Route,
  ShoppingCart,
  Menu,
  X,
  Leaf,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'passport', label: 'Material Passport', icon: FileCheck },
  { id: 'green-route', label: 'Green Route', icon: Leaf },
  { id: 'supply-chain', label: 'Supply Chain', icon: Route },
];

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-700">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 flex items-center justify-center">
                <img 
                  src="/icon.png" 
                  alt="Heidelberg Materials" 
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <div>
                <h1 className="font-bold text-ml">Heidelberg Materials</h1>
                <p className="text-xs text-slate-400">BiH</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div
            className={`${
              sidebarOpen ? 'px-4 py-3' : 'px-2 py-2'
            } bg-slate-800 rounded-lg`}
          >
            {sidebarOpen ? (
              <>
                <p className="text-xs text-slate-400 mb-1">CBAM Regulation</p>
                <p className="text-sm font-medium">EU 2023/956</p>
              </>
            ) : (
              <p className="text-xs text-center text-slate-400">EU</p>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
