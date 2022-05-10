import { useMediaQuery } from 'react-responsive'

export const isTabletOrMobile = () =>
  useMediaQuery({ query: '(max-width: 1224px)' })
