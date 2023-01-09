import './lib/handleDrag'
import './App.module.css'

import { call, Methods } from './lib/api'
import { hid } from './lib/hid'
import { useFilter } from './lib/sotore'

import { FC, StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

export const App: FC = () => {
  const [devices] = useFilter(hid, 'devices')

  useEffect(() => {}, [])

  return (
    <div>
      {devices.map((device) => {
        return <div>{device.name}</div>
      })}
      <button>test</button>
      <img src="./keyimg.png" alt="" />
    </div>
  )
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

call(Methods.GetKeyboard, {}).then(console.log, alert)
