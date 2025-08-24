import { useEffect, useCallback } from 'react'
import { useMapStore } from '@/stores/mapStore'

interface KeyboardHandlerProps {
  children: React.ReactNode
}

export function KeyboardHandler({ children }: KeyboardHandlerProps) {
  const { undo, redo, canUndo, canRedo } = useMapStore()

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Check for modifier keys
    const isCtrlCmd = event.ctrlKey || event.metaKey
    const isShift = event.shiftKey

    // Undo/Redo shortcuts
    if (isCtrlCmd && event.key === 'z' && !isShift && canUndo()) {
      event.preventDefault()
      undo()
      return
    }

    if (isCtrlCmd && ((event.key === 'z' && isShift) || event.key === 'y') && canRedo()) {
      event.preventDefault()
      redo()
      return
    }

    // Canvas navigation shortcuts
    if (event.key === 'f' && !isCtrlCmd) {
      event.preventDefault()
      // TODO: Trigger fit to screen
      console.log('Fit to screen triggered')
      return
    }

    if (event.key === 'c' && !isCtrlCmd) {
      event.preventDefault()
      // TODO: Center on selection
      console.log('Center on selection triggered')
      return
    }

    // Zoom shortcuts
    if (isCtrlCmd && event.key === '0') {
      event.preventDefault()
      // TODO: Fit to screen (alternative)
      console.log('Fit to screen (Ctrl+0) triggered')
      return
    }

    if (isCtrlCmd && (event.key === '+' || event.key === '=')) {
      event.preventDefault()
      // TODO: Zoom in
      console.log('Zoom in triggered')
      return
    }

    if (isCtrlCmd && event.key === '-') {
      event.preventDefault()
      // TODO: Zoom out
      console.log('Zoom out triggered')
      return
    }
  }, [undo, redo, canUndo, canRedo])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return <>{children}</>
}