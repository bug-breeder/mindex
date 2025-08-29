import { useState } from "react";
import { FolderTree } from "@/components/sidebar/FolderTree";
import { TabBar } from "@/components/TabBar";
import { BurgerMenu } from "@/components/BurgerMenu";
import { NewMapDialog } from "@/components/NewMapDialog";
import { Button } from "@heroui/button";
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon, FolderIcon } from "@heroicons/react/24/outline";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [fileTreeOpen, setFileTreeOpen] = useState(false);
  const [newMapDialogOpen, setNewMapDialogOpen] = useState(false);

  return (
    <div className="h-screen relative bg-background">
      {/* Floating Tab Bar - Top Center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-content1/80 backdrop-blur-sm rounded-xl shadow-lg border border-divider">
          <TabBar className="rounded-xl overflow-hidden" />
        </div>
      </div>

      {/* Floating Controls - Top Right (All Controls) */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button 
          isIconOnly 
          variant="shadow"
          onPress={() => window.history.back()}
          className="bg-background/80 backdrop-blur-sm"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        
        <Button 
          isIconOnly 
          variant="shadow"
          onPress={() => window.history.forward()}
          className="bg-background/80 backdrop-blur-sm"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </Button>
        
        <Button 
          isIconOnly 
          variant="shadow"
          color="primary"
          onPress={() => setNewMapDialogOpen(true)}
        >
          <PlusIcon className="h-5 w-5" />
        </Button>
        
        <Button 
          isIconOnly 
          variant="shadow"
          onPress={() => setFileTreeOpen(!fileTreeOpen)}
          className="bg-background/80 backdrop-blur-sm"
        >
          <FolderIcon className="h-5 w-5" />
        </Button>
        
        <BurgerMenu />
      </div>

      {/* File Tree Panel */}
      {fileTreeOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 z-40"
            onClick={() => setFileTreeOpen(false)}
          />
          
          {/* Floating Panel */}
          <div className="absolute top-20 right-4 left-4 sm:left-auto sm:w-80 bg-content1 border shadow-xl rounded-xl z-50 max-h-[calc(100vh-96px)]">
            <FolderTree onClose={() => setFileTreeOpen(false)} />
          </div>
        </>
      )}
      
      {/* Full-screen Content */}
      <main className="h-full w-full">
        {children}
      </main>
      
      {/* New Map Dialog */}
      <NewMapDialog 
        isOpen={newMapDialogOpen} 
        onClose={() => setNewMapDialogOpen(false)} 
      />
    </div>
  );
}


