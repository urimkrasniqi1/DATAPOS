import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Warehouse,
  Users,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  ClipboardList,
  Menu,
  X,
  Smartphone
} from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Paneli', roles: ['admin', 'manager', 'cashier'] },
    { path: '/pos', icon: ShoppingCart, label: 'Arka', roles: ['admin', 'manager', 'cashier'] },
    { path: '/products', icon: Package, label: 'Produktet', roles: ['admin', 'manager'] },
    { path: '/stock', icon: Warehouse, label: 'Stoku', roles: ['admin', 'manager'] },
    { path: '/users', icon: Users, label: 'Përdoruesit', roles: ['admin', 'manager'] },
    { path: '/branches', icon: Building2, label: 'Degët', roles: ['admin'] },
    { path: '/reports', icon: BarChart3, label: 'Raportet', roles: ['admin', 'manager'] },
    { path: '/audit-logs', icon: ClipboardList, label: 'Audit Log', roles: ['admin'] },
    { path: '/settings', icon: Settings, label: 'Cilësimet', roles: ['admin'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-[#3b82f6] text-white shadow-md'
            : 'text-[#94a3b8] hover:bg-[#2a2f38] hover:text-[#f1f5f9]'
        }`
      }
    >
      <item.icon className="h-5 w-5" />
      <span className="font-medium">{item.label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a1d23' }}>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3" style={{ backgroundColor: '#22262e', borderBottom: '1px solid #374151' }}>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            data-testid="mobile-menu-btn"
            className="text-[#f1f5f9] hover:bg-[#2a2f38]"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#3b82f6' }}>
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-white">Mobilshop</span>
              <span style={{ color: '#94a3b8' }}>urimi</span>
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="user-menu-mobile" className="hover:bg-[#2a2f38]">
                <Avatar className="h-8 w-8">
                  <AvatarFallback style={{ backgroundColor: '#3b82f6' }} className="text-white">
                    {user?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" style={{ backgroundColor: '#22262e', border: '1px solid #374151' }}>
              <div className="px-3 py-2">
                <p className="font-medium text-[#f1f5f9]">{user?.full_name}</p>
                <p className="text-sm text-[#94a3b8]">{user?.username}</p>
              </div>
              <DropdownMenuSeparator style={{ backgroundColor: '#374151' }} />
              <DropdownMenuItem onClick={handleLogout} className="text-[#ef4444] hover:bg-[#2a2f38]">
                <LogOut className="h-4 w-4 mr-2" />
                Çkyçu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#1a1d23', borderRight: '1px solid #374151' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center" style={{ borderBottom: '1px solid #374151' }}>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#3b82f6' }}>
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="text-white">Mobilshop</span>
              <span style={{ color: '#94a3b8' }}>urimi</span>
            </span>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="h-[calc(100vh-8rem)] py-4 px-3">
          <nav className="space-y-1">
            {filteredMenu.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
        </ScrollArea>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4" style={{ borderTop: '1px solid #374151', backgroundColor: '#1a1d23' }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-auto py-2 text-[#f1f5f9] hover:bg-[#2a2f38]"
                data-testid="user-menu-desktop"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback style={{ backgroundColor: '#3b82f6' }} className="text-white font-semibold">
                    {user?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm text-[#f1f5f9]">{user?.full_name}</span>
                  <span className="text-xs text-[#94a3b8] capitalize">{user?.role}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" style={{ backgroundColor: '#22262e', border: '1px solid #374151' }}>
              <div className="px-3 py-2">
                <p className="text-sm text-[#94a3b8]">@{user?.username}</p>
              </div>
              <DropdownMenuSeparator style={{ backgroundColor: '#374151' }} />
              <DropdownMenuItem onClick={handleLogout} className="text-[#ef4444] hover:bg-[#2a2f38] cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Çkyçu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0" style={{ backgroundColor: '#1a1d23' }}>
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
