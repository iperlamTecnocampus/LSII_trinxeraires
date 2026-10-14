import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full flex-col">
                <Header />

                <div className="flex flex-1">
                    <AppSidebar />

                    <div className="min-w-0 flex-1">
                        <main className="p-4">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}