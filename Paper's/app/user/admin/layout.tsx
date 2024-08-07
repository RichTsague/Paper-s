import SidebarAdmin from "@/components/SidebarAdmin";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div id="adminContent" className="sm:flex sm:flex-grow w-full">
      <SidebarAdmin />
      {children}
    </div>
  );
}
