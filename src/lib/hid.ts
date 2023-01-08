import { assign, sotore } from './sotore'

export type HidDevice = {
  name: string
  vendorId: number
  productId: number
}

let lastInterval: number | undefined

const store = sotore({
  devices: [] as HidDevice[],
})

export const hid = assign(store, () => {
  return {
    useGlobalPoll() {},

    // startPolling(interval: number) {
    //   if (lastInterval != null) {
    //     throw Error('Double timers are not allowed')
    //   }

    //   lastInterval = setInterval(() => {
    //     call(Methods.GetDevices, {})
    //       .then((devices) => {
    //         if (devices.length > 0) {
    //           console.log(devices)
    //           store.set({ devices })
    //         }
    //       })
    //       .catch(() => {})
    //   }, interval)
    // },

    // stopPolling() {
    //   clearInterval(lastInterval)
    //   lastInterval = undefined
    // },
  }
})
