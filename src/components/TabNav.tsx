import { ArrowDownUp, Settings, Users, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function TabNav() {
  const location = useLocation();
  const path = location.pathname;
  const tabs = [
    { name: 'Transactions', icon: <ArrowDownUp />, route: '/transactions/' },
    { name: 'Configuration', icon: <Users />, route: '/config/' },
    { name: 'Programs', icon: <Box />, route: '/programs/' },
    { name: 'Settings', icon: <Settings />, route: '/settings/' },
  ];

  return (
    <>
      <aside
        id="sidebar"
        className="z-40 hidden h-auto md:fixed md:left-0 md:top-0 md:block md:h-screen md:w-56"
        aria-label="Sidebar"
      >
        <div className="flex h-auto flex-col justify-between overflow-y-auto bg-[#111318] px-3 py-5 md:h-full md:border-r md:border-[#1e2028]">
          <div>
            <Link to="/">
              <div className="mb-8 flex items-center px-3 py-2">
                <img src="/logo.png" width="140" height="auto" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
            </Link>
            <ul className="space-y-0.5 text-sm font-medium">
              {tabs.map((tab) => {
                const isActive =
                  (path!.startsWith(`${tab.route}/`) && tab.route !== '/') ||
                  tab.route === path;
                return (
                  <li key={tab.route}>
                    <Link
                      to={tab.route}
                      className={`flex items-center rounded-md px-3 py-2.5 transition-colors ${
                        isActive
                          ? 'bg-white/[0.08] text-white'
                          : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
                      }`}
                    >
                      <span className="[&>svg]:h-4 [&>svg]:w-4">{tab.icon}</span>
                      <span className="ml-3 flex-1 whitespace-nowrap text-sm">
                        {tab.name}
                      </span>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </aside>
      <aside
        id="mobile-navbar"
        className="fixed inset-x-0 bottom-0 z-50 block bg-[#111318] border-t border-[#1e2028] p-2 md:hidden"
        aria-label="Mobile navbar"
      >
        <div className="mx-auto mt-1 grid h-full max-w-lg grid-cols-4 font-medium">
          {tabs.map((tab) => {
            const isActive =
              (path!.startsWith(`${tab.route}/`) && tab.route !== '/') ||
              tab.route === path;
            return (
              <Link to={tab.route} key={tab.route} className="flex justify-center">
                <button
                  type="button"
                  className={`group inline-flex flex-col items-center justify-center rounded-md px-2 py-2 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab.icon}
                  <span className="mt-1 whitespace-nowrap text-xs">{tab.name}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
