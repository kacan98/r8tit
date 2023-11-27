export interface ErrorMessage {
  headerIconName?: string
  text: string
  header: string
  interpolateParams?: any
  actions?: {
    callback: () => void
    actionText: string
    iconName?: string
  }[]
}
