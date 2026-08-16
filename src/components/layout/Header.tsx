
export default function Header() {
  const today = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Happy Feet Podiatry
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          AI Agent Revenue Dashboard
        </h1>
      </div>

      <div className="text-sm text-slate-500">{today}</div>
    </header>
  );
}