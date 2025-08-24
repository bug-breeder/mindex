import { Switch } from "@heroui/switch";
import { useUIStore } from "@/stores/uiStore";
import { SunIcon, MoonIcon } from "./icons";

export function ThemeSwitch() {
  const { theme, setTheme } = useUIStore();
  
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const handleThemeChange = (isSelected: boolean) => {
    setTheme(isSelected ? 'dark' : 'light');
  };

  return (
    <Switch
      isSelected={isDark}
      onValueChange={handleThemeChange}
      size="lg"
      color="primary"
      startContent={<SunIcon />}
      endContent={<MoonIcon />}
    />
  );
}