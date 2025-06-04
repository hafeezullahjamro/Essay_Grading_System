import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

type SidebarProps = {
  activePage: "dashboard" | "grade" | "export" | "history" | "profile";
};

export default function Sidebar({ activePage }: SidebarProps) {
  const { user } = useAuth();
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "fas fa-home", path: "/dashboard" },
    { id: "grade", label: "Grade Essay", icon: "fas fa-edit", path: "/grade" },
    { id: "export", label: "Export Results", icon: "fas fa-download", path: "/export" },
    { id: "profile", label: "Profile", icon: "fas fa-user", path: "/profile" },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link href="/">
                <a className="text-2xl font-bold text-primary">CorestoneGrader</a>
              </Link>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {menuItems.map((item) => (
                <Link key={item.id} href={item.path}>
                  <a
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      activePage === item.id
                        ? "bg-blue-50 text-blue-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <i
                      className={cn(
                        `${item.icon} mr-3`,
                        activePage === item.id
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      )}
                    ></i>
                    {item.label}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    <i className="fas fa-user-circle text-lg"></i>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.email}
                  </p>
                  <Link href="/profile">
                    <a className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                      View profile
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
