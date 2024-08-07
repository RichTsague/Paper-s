import SidebarProfesseur from "@/components/SidebarProfesseur";

export default function ProfesseurLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-grow w-full">
      <SidebarProfesseur />
      {children}
    </div>
  );
}
