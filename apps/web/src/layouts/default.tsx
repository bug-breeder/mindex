import { Navbar } from "@/components/navbar";
import { FileTree } from "@/components/sidebar/FileTree";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <aside className="hidden md:block w-72 shrink-0 border-r px-4 py-4">
          <FileTree />
        </aside>
        <main className="flex-1 container mx-auto max-w-5xl px-6">
          {children}
        </main>
      </div>
      <footer className="w-full flex items-center justify-center py-3">
        <div className="flex items-center gap-1 text-current">
          <span className="text-default-600">Made with</span>
          <p className="text-primary">❤️</p>
          <span className="text-default-600">by</span>
          <p className="text-primary font-semibold">Mindex</p>
        </div>
      </footer>
    </div>
  );
}
