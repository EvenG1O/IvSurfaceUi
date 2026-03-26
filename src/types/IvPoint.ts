export interface IvPoint {
  expiry: string
  strike: number
  type: 'put' | 'call'
  iv: number
  moneyness: number
}
