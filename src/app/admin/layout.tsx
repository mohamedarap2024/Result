export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-theme min-h-screen bg-[#080c12] text-slate-100">
      {children}
    </div>
  );
}
