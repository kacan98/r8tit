export interface ActionResponse<T extends any> {
  message: string;
  entity: T;
}
