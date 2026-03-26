import type { IvExpiry } from './IvExpiry'

export interface IvSurface {
  atmPrice: number
  timestamp: string
  currency: string
  expiries: IvExpiry[]
}
