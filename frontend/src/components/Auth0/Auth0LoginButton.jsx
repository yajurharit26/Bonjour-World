"use client"

import { useAuth0 } from "@auth0/auth0-react"
import { useDispatch } from "react-redux"
import { closeModal } from "../../store/modal"
import { useHistory } from "react-router-dom"

function Auth0LoginButton() {
  const { loginWithRedirect } = useAuth0()
  const dispatch = useDispatch()
  const history = useHistory()

  const handleLogin = async () => {
    try {
      await loginWithRedirect({
        appState: { returnTo: "/events" },
      })
      dispatch(closeModal())
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  return (
    <button onClick={handleLogin} className="auth0-login-button">
      Login with Auth0
    </button>
  )
}

export default Auth0LoginButton
