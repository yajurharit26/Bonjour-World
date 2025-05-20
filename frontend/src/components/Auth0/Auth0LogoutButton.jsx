"use client"

import { useAuth0 } from "@auth0/auth0-react"
import { useDispatch } from "react-redux"
import { RECEIVE_USER_LOGOUT } from "../../store/session"

function Auth0LogoutButton() {
  const { logout } = useAuth0()
  const dispatch = useDispatch()

  const handleLogout = () => {
    
    localStorage.removeItem("jwtToken")

    
    dispatch({ type: RECEIVE_USER_LOGOUT })

    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
  }

  return (
    <button onClick={handleLogout} className="auth0-logout-button">
      Logout
    </button>
  )
}

export default Auth0LogoutButton
