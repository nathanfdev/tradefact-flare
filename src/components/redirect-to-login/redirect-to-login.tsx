import { useEffect } from 'react'

export interface RedirectToLoginProps {
  login: () => void
}

const RedirectToLogin = ({ login }: RedirectToLoginProps) => {
  useEffect(() => {
    login()
  }, [login])

  return null
}

export default RedirectToLogin
