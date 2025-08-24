import DefaultLayout from '@/layouts/default'
import { ThemeSwitch } from '@/components/theme'
import { useUIStore } from '@/stores/uiStore'

export default function SettingsPage() {
  const { theme, setTheme } = useUIStore()

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-on-surface/70">
            Customize your MindCanvas experience
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="p-4 border border-outline rounded-lg">
            <h3 className="font-semibold mb-3">Appearance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">Theme</label>
                <div className="flex items-center gap-2">
                  <select 
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                    className="px-3 py-1 border border-outline rounded text-sm bg-surface"
                  >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
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
                <select className="px-3 py-1 border border-outline rounded text-sm bg-surface">
                  <option value="right-balanced">Right Balanced</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-outline rounded-lg">
            <h3 className="font-semibold mb-3">AI Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">Default Mode</label>
                <select className="px-3 py-1 border border-outline rounded text-sm bg-surface">
                  <option value="extract">Extract</option>
                  <option value="summarize">Summarize</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}