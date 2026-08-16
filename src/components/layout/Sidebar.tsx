import {
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  Settings,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Bookings",
    icon: CalendarDays,
  },
  {
    name: "Analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-slate-200 bg-white px-5 py-6 lg:block">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Happy Feet
        </p>

        <h2 className="mt-2 text-xl font-bold text-slate-900">
          Revenue Dashboard
        </h2>
      </div>

      <nav className="space-y-2">
        {navigation.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === 0;

          return (
            <button
              key={item.name}
              type="button"
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}