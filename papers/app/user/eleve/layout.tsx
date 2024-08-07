import SidebarEleve from "@/components/SidebarEleve";

export default function EleveLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-grow w-full">
      <SidebarEleve />
      {children}
    </div>
  );
}
