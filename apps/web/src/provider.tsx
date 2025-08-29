import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { useHref, useNavigate } from "react-router-dom";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <HeroUIProvider navigate={navigate} useHref={useHref}>
            {children}
            <ToastProvider placement="bottom-right" />
          </HeroUIProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
