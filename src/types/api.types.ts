export type ApiResponse<T> = {
  data: T
  meta?: ApiMeta
}

export type ApiErrorResponse = {
  error: string
  details?: string[]
}

export type ApiMeta = {
  page: number
  pageSize: number
  total: number
}
