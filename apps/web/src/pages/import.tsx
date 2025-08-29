import AppLayout from '@/layouts/AppLayout'

export default function ImportPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Import Content</h1>
          <p className="text-on-surface/70">
            Transform any content into an editable mind map
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 border border-outline rounded-lg hover:shadow-m1 transition-shadow cursor-pointer">
            <div className="text-2xl mb-2">🌐</div>
            <h3 className="font-semibold mb-2">Web URL</h3>
            <p className="text-sm text-on-surface/70">
              Import from any webpage or article
            </p>
          </div>
          
          <div className="p-6 border border-outline rounded-lg hover:shadow-m1 transition-shadow cursor-pointer">
            <div className="text-2xl mb-2">🎥</div>
            <h3 className="font-semibold mb-2">YouTube Video</h3>
            <p className="text-sm text-on-surface/70">
              Extract transcript and create outline
            </p>
          </div>
          
          <div className="p-6 border border-outline rounded-lg hover:shadow-m1 transition-shadow cursor-pointer">
            <div className="text-2xl mb-2">📄</div>
            <h3 className="font-semibold mb-2">PDF Document</h3>
            <p className="text-sm text-on-surface/70">
              Convert PDF content to mind map
            </p>
          </div>
          
          <div className="p-6 border border-outline rounded-lg hover:shadow-m1 transition-shadow cursor-pointer">
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-semibold mb-2">Text/DOCX</h3>
            <p className="text-sm text-on-surface/70">
              Import from text or Word documents
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}