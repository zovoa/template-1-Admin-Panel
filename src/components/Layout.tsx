import React, { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children} {/* ✅ This replaces <Outlet /> */}
        </div>
      </main>
    </div>
  );
};

export default Layout;
