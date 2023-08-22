export const getFirstLetter = (name: string): string => {
   return name?.slice(0, 1).toLowerCase() || ''
}
