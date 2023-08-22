import { useEffect, useState } from 'react'

export interface IUseWindowSize {
  height: number,
  width: number,
}


export const useWindowSize = ():IUseWindowSize => {
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const resizeHandler = () => {
    setHeight(window.innerHeight)
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener("resize", resizeHandler)
    resizeHandler()
    return () => {
      window.removeEventListener("resize", resizeHandler)
    }
  }, [])
  return { height, width }
}
