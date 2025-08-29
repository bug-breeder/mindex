import AppLayout from '@/layouts/AppLayout'
import { ThemeSwitch } from '@/components/theme'
import { useUIStore } from '@/stores/uiStore'
import { Select, SelectItem } from '@heroui/select'

export default function SettingsPage() {
  const { theme, setTheme } = useUIStore()

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-on-surface/70">
            Customize your Mindex experience
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="p-4 border border-outline rounded-lg">
            <h3 className="font-semibold mb-3">Appearance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">Theme</label>
                <div className="flex items-center gap-2">
                  <Select
                    aria-label="Theme"
                    selectedKeys={[theme]}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys as Set<string>)[0] as 'light' | 'dark' | 'system'
                      if (key) setTheme(key)
                    }}
                    className="min-w-[160px]"
                  >
                    <SelectItem key="system">System</SelectItem>
                    <SelectItem key="light">Light</SelectItem>
                    <SelectItem key="dark">Dark</SelectItem>
                  </Select>
                  <ThemeSwitch />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-outline rounded-lg">
            <h3 className="font-semibold mb-3">Canvas</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">Default Layout</label>
                <Select aria-label="Default Layout" selectedKeys={["right-balanced"]} className="min-w-[180px]">
                  <SelectItem key="right-balanced">Right Balanced</SelectItem>
                  <SelectItem key="left">Left</SelectItem>
                  <SelectItem key="right">Right</SelectItem>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-outline rounded-lg">
            <h3 className="font-semibold mb-3">AI Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">Default Mode</label>
                <Select aria-label="Default Mode" selectedKeys={["extract"]} className="min-w-[160px]">
                  <SelectItem key="extract">Extract</SelectItem>
                  <SelectItem key="summarize">Summarize</SelectItem>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}