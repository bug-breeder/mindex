import { Navbar } from "@/components/navbar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
      <footer className="border-t border-divider">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="text-default-600">Made with</span>
              <span className="text-primary">❤️</span>
              <span className="text-default-600">by</span>
              <span className="text-primary font-semibold">Mindex</span>
            </div>
            <div className="text-sm text-default-500">
              © 2024 Mindex. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
