export interface UserState {
  tenantId: string
  refreshToken: string
  userInfo: Record<string, any>
  token?: string
  website: object
  handleConfirm?: object
  nowStudentInfo?: object
}
export interface getAddressData {
  modelName?: string
}
export interface loginByTicketParam {
  ticket?: string
}
export interface getSignatureParam {
  url?: string
}
export interface combLoginToMicroServiceParam {
  modelName: string
  userId: string
}
