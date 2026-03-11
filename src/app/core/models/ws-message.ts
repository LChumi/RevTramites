export interface WsMessage {

  type: string
  channel?: string
  message: string
  user?: string
  target?: string

}
