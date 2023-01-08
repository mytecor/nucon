import { appWindow } from '@tauri-apps/api/window'

const handleDrag = (e: MouseEvent): void => {
  if ((e.target as HTMLElement)?.closest('input, a, button') != null) {
    return
  }

  appWindow.startDragging().catch(() => {})
}

document.addEventListener('mousedown', handleDrag)
