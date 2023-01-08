import { invoke } from '@tauri-apps/api/tauri'
import camelize, { CamelCaseKeys } from 'camelcase-keys'
import decamelize from 'decamelize-keys'

export enum Methods {
  GetKeyboard = 'connect_to_keyboard',
}

type RawApi = {
  [Methods.GetKeyboard]: {
    params: {}
    result: Array<{
      name: string
      vendor_id: number
      product_id: number
    }>
  }
}

export type Api = {
  [K in keyof RawApi]: CamelCaseKeys<RawApi[K], true>
}

export const call = async <Method extends Methods>(
  method: Method,
  params: Api[Method]['params'],
): Promise<Api[Method]['result']> => {
  const data = await invoke<RawApi[Method]['result']>(
    method,
    decamelize(params, { deep: true }),
  )

  return camelize(data, { deep: true })
}
