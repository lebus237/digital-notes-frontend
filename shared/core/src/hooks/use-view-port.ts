import React from 'react'
import { SCREEN_SIZE } from '#/constant/screens'

export type ScreenType = {
  isMobile?: boolean
  isTablet?: boolean
  isDesktop?: boolean
}

const getScreenType = (): Required<ScreenType> => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return { isMobile: false, isTablet: false, isDesktop: true }
  }

  const width = window.innerWidth

  return {
    isMobile: width <= SCREEN_SIZE.MOBILE,
    isTablet: width > SCREEN_SIZE.MOBILE && width <= SCREEN_SIZE.TABLET,
    isDesktop: width > SCREEN_SIZE.TABLET,
  }
}

export const useViewPort = () => {
  const [screenType, setScreenType] = React.useState<ScreenType>(getScreenType)

  React.useEffect(() => {
    const handleResize = () => setScreenType(getScreenType())

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return screenType
}
