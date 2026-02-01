import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black">
            <Sidebar />
            <main className="lg:pl-64 min-h-screen">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
