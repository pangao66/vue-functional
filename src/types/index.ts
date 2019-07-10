export type fnTypeLit = 'date' | 'point2' | 'rmb'

export interface Fn {
  type: fnTypeLit;
  content?: string;
}
