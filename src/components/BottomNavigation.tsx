import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

interface BadgeProps {
  count?: number;
  show?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ count, show = false }) => {
  if (!show || !count) return null;

  return (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
      {count > 99 ? "99+" : count}
    </span>
  );
};

interface NavItemProps {
  to?: string;
  href?: string;
  children: React.ReactNode;
  badge?: number;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  to,
  href,
  children,
  badge,
  isActive,
}) => {
  const baseClasses =
    "relative flex flex-col items-center p-2 rounded-xl transition-all duration-300 min-h-[60px] min-w-[60px]";
  const activeClasses = isActive
    ? "bg-navy-blue-50 scale-105"
    : "hover:bg-gray-50 active:scale-95";

  const content = (
    <div className={`${baseClasses} ${activeClasses}`}>
      {children}
      <Badge count={badge} show={!!badge} />
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
};

export default function BottomNavigation() {
  const location = useLocation();
  const [wishlistCount, setWishlistCount] = useState(0);

  // Mock wishlist count - replace with real data
  useEffect(() => {
    // Simulate wishlist count from localStorage or API
    const count = localStorage.getItem("wishlist-count");
    setWishlistCount(count ? parseInt(count) : 0);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Safe area spacer for devices with bottom safe area */}
      <div className="h-20 lg:hidden" />

      <nav
        id="Bottom-nav"
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)", // iOS safe area
        }}
      >
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
          <div className="max-w-md mx-auto px-4 py-2">
            <div className="grid grid-cols-4 gap-1">
              {/* Home */}
              <NavItem to="/" isActive={isActive("/")}>
                <div
                  className={`flex flex-col items-center text-center gap-1 transition-all duration-300 ${
                    isActive("/") ? "text-navy-blue-800" : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-8 h-8 flex shrink-0 p-1.5 rounded-lg ${
                      isActive("/") ? "bg-navy-blue-100" : "bg-gray-50"
                    }`}
                  >
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 22V12H15V22"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="font-semibold text-xs">Home</p>
                </div>
              </NavItem>

              {/* Browse Products */}
              <NavItem
                to="/browse-product"
                isActive={isActive("/browse-product")}
              >
                <div
                  className={`flex flex-col items-center text-center gap-1 transition-all duration-300 ${
                    isActive("/browse-product")
                      ? "text-navy-blue-800"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-8 h-8 flex shrink-0 p-1.5 rounded-lg ${
                      isActive("/browse-product")
                        ? "bg-navy-blue-100"
                        : "bg-gray-50"
                    }`}
                  >
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth={2}
                      />
                      <rect
                        x="14"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth={2}
                      />
                      <rect
                        x="14"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth={2}
                      />
                      <rect
                        x="3"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <p className="font-semibold text-xs">Koleksi</p>
                </div>
              </NavItem>

              {/* Cara Sewa */}
              <NavItem to="/cara-sewa" isActive={isActive("/cara-sewa")}>
                <div
                  className={`flex flex-col items-center text-center gap-1 transition-all duration-300 ${
                    isActive("/cara-sewa")
                      ? "text-navy-blue-800"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-8 h-8 flex shrink-0 p-1.5 rounded-lg ${
                      isActive("/cara-sewa") ? "bg-navy-blue-100" : "bg-gray-50"
                    }`}
                  >
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="font-semibold text-xs">Cara Sewa</p>
                </div>
              </NavItem>

              {/* Registration */}
              <NavItem
                href="https://admin.globalphotorental.com/register"
                badge={wishlistCount}
              >
                <div className="flex flex-col items-center text-center gap-1 transition-all duration-300 text-gray-500">
                  <div className="w-8 h-8 flex shrink-0 p-1.5 bg-gray-50 rounded-lg">
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="8.5"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth={2}
                      />
                      <path
                        d="M20 8V14"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M23 11H17"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="font-semibold text-xs">Daftar</p>
                </div>
              </NavItem>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
