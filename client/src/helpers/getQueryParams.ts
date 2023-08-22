export const getQueryParams = (params?: { [key: string]: string }) => {
  if (!params) return ''

  const reqParams = new URLSearchParams(params)

  return `?${reqParams.toString()}`
}
