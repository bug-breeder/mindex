import { useEffect, useRef, useCallback } from "react";
import MindElixir from "mind-elixir";
import "mind-elixir/style.css";
import type { MindMapJson } from "@/stores/mapStore";
import { useMapStore } from "@/stores/mapStore";

// Mind-Elixir type definitions
interface MindElixirInstance {
  bus: {
    addListener: (event: string, callback: (data: unknown) => void) => void;
    removeListener: (event: string, callback: (data: unknown) => void) => void;
  };
  init: () => void;
  destroy: () => void;
  getData: () => MindMapJson;
  refresh: () => void;
  findNodeById: (id: string) => MindElixirNode | null;
  selectNode: (node: MindElixirNode) => void;
  exportPng: () => void;
  exportSvg: () => void;
}

interface MindElixirNode {
  id: string;
  topic: string;
  children?: MindElixirNode[];
  parent?: MindElixirNode;
}





// We'll use MindElixir.new() to create proper data format


interface MindCanvasProps {
  data?: MindMapJson | null;
  className?: string;
  onInstanceReady?: (instance: MindElixirInstance) => void;
}

export function MindCanvas({ data, className = "h-full w-full", onInstanceReady }: MindCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<MindElixirInstance | null>(null);
  const { updateMap, select, selectedId } = useMapStore();

  const handleMapChange = useCallback(() => {
    console.log('Map change detected');
    if (!instanceRef.current) return;
    
    try {
      const currentData = instanceRef.current.getData();
      console.log('Current data from Mind-Elixir:', currentData);
      if (currentData && data) {
        // Mind-Elixir getData() returns either the nodeData directly or wrapped in {nodeData}
        const rootNode = currentData.nodeData || currentData;
        
        const updatedMap: MindMapJson = {
          ...data,
          root: rootNode, // Store the actual node data, not the wrapper
        };
        updateMap(() => updatedMap);
        console.log('Map updated successfully with root:', rootNode);
      }
    } catch (error) {
      console.error('Error updating map data:', error);
    }
  }, [data, updateMap]);

  const handleSelection = useCallback((nodeId: string) => {
    console.log('Node selected:', nodeId);
    select(nodeId);
  }, [select]);

  // Initialize Mind-Elixir
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clean up existing instance
    if (instanceRef.current) {
      try {
        instanceRef.current.destroy?.();
        instanceRef.current = null;
      } catch (error) {
        console.error('Error cleaning up existing instance:', error);
      }
    }

    // Use provided data or create simple data
    const nodeData = data?.root || MindElixir.new('Root Topic');
    
    try {
      console.log('Creating Mind-Elixir with simple setup...');
      
      const me = new MindElixir({
        el: containerRef.current,
        direction: MindElixir.LEFT,
        draggable: true,
        toolBar: true,
        nodeMenu: true,
        keypress: true,
        locale: 'en',
        overflowHidden: false,
        theme: {
          name: 'magenta',
          palette: [
            '#d946ef',
            '#748EFC', 
            '#5B9BD5',
            '#32CD32',
            '#FF6B6B',
            '#FFE66D',
            '#FF8C42',
            '#8E7CC3',
          ],
          cssVar: {
            '--main-color': '#d946ef',
            '--main-bgcolor': '#ffffff',
            '--selected': '#d946ef'
          }
        }
      });

      console.log('Initializing with data...');
      me.init(nodeData);
      
      // Add event listeners for editing (only if we have callbacks)
      if (handleMapChange) {
        me.bus.addListener('operation', (operation: unknown) => {
          console.log('Operation detected:', operation);
          handleMapChange();
        });
      }
      
      if (handleSelection) {
        me.bus.addListener('selectNodes', (nodes: unknown) => {
          console.log('Node selection detected:', nodes);
          if (nodes && nodes.length > 0 && nodes[0].id) {
            handleSelection(nodes[0].id);
          }
        });
      }

      instanceRef.current = me;
      onInstanceReady?.(me);
      
      console.log('Mind-Elixir initialized successfully!');
      
      // Check after a short delay
      setTimeout(() => {
        const meNodes = containerRef.current?.querySelector('me-nodes');
        const meRoot = containerRef.current?.querySelector('me-root');
        console.log('After 1s - me-nodes children:', meNodes?.children.length);
        console.log('After 1s - me-root content:', meRoot?.innerHTML?.substring(0, 100));
        
        if (!meRoot || meNodes?.children.length === 0) {
          console.warn('Mind-Elixir not properly initialized - this might indicate a CSS or data issue');
        }
      }, 1000);
      
    } catch (error) {
      console.error('Failed to initialize Mind-Elixir:', error);
    }

    return () => {
      if (instanceRef.current) {
        try {
          instanceRef.current.destroy?.();
        } catch (error) {
          console.error('Error destroying Mind-Elixir:', error);
        }
        instanceRef.current = null;
      }
    };
  }, [data?.root, handleMapChange, handleSelection, onInstanceReady]);

  // Update data when it changes - recreate instance for reliability
  useEffect(() => {
    if (!instanceRef.current || !data?.root || !containerRef.current) return;
    
    try {
      console.log('Updating Mind-Elixir with new data...');
      
      // Clean up and recreate instance for reliable data updates
      instanceRef.current.destroy?.();
      instanceRef.current = null;
      
      const me = new MindElixir({
        el: containerRef.current,
        direction: MindElixir.LEFT,
        draggable: true,
        toolBar: true,
        nodeMenu: true,
        keypress: true,
        locale: 'en',
        overflowHidden: false,
        theme: {
          name: 'magenta',
          palette: [
            '#d946ef',
            '#748EFC', 
            '#5B9BD5',
            '#32CD32',
            '#FF6B6B',
            '#FFE66D',
            '#FF8C42',
            '#8E7CC3',
          ],
          cssVar: {
            '--main-color': '#d946ef',
            '--main-bgcolor': '#ffffff',
            '--selected': '#d946ef'
          }
        }
      });
      
      // Ensure data has proper Mind-Elixir structure
      // Mind-Elixir expects either raw node data or {nodeData: node}
      let nodeData;
      if (data.root.nodeData) {
        // Data is already wrapped
        nodeData = {
          nodeData: {
            ...data.root.nodeData,
            parent: null
          }
        };
      } else {
        // Data is raw node, wrap it
        nodeData = {
          nodeData: {
            ...data.root,
            parent: null
          }
        };
      }
      
      console.log('Initializing with structured data:', nodeData);
      
      me.init(nodeData);
      
      // Add event listeners for editing (only if we have callbacks)
      if (handleMapChange) {
        me.bus.addListener('operation', (operation: unknown) => {
          console.log('Operation detected:', operation);
          handleMapChange();
        });
      }
      
      if (handleSelection) {
        me.bus.addListener('selectNodes', (nodes: unknown) => {
          console.log('Node selection detected:', nodes);
          if (nodes && nodes.length > 0 && nodes[0].id) {
            handleSelection(nodes[0].id);
          }
        });
      }
      
      instanceRef.current = me;
      onInstanceReady?.(me);
      
      console.log('Mind-Elixir updated successfully!');
      
    } catch (error) {
      console.error('Error updating Mind-Elixir:', error);
    }
  }, [data?.id, data?.root, handleMapChange, handleSelection, onInstanceReady]);

  // Handle external selection changes
  useEffect(() => {
    if (!instanceRef.current || !selectedId) return;
    
    try {
      // Use the proper Mind-Elixir API for finding and selecting nodes
      if (typeof instanceRef.current.selectNodeById === 'function') {
        instanceRef.current.selectNodeById(selectedId);
      } else if (typeof instanceRef.current.findEle === 'function') {
        const element = instanceRef.current.findEle(selectedId);
        if (element && typeof instanceRef.current.selectNode === 'function') {
          instanceRef.current.selectNode(element);
        }
      }
    } catch (error) {
      console.error('Error selecting node:', error);
    }
  }, [selectedId, data.root, handleMapChange, handleSelection, onInstanceReady]);

  return (
    <div 
      ref={containerRef} 
      className={`${className}`}
      id="mind-elixir-container"
      style={{ 
        minHeight: '400px', 
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        overflow: 'hidden'
      }}
    />
  );
}