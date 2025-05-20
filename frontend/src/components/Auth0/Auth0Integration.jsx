"use client"

import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { receiveCurrentUser } from "../../store/session"

function Auth0Integration() {
  const { isAuthenticated, user, isLoading, getAccessTokenSilently } = useAuth0()
  const dispatch = useDispatch()

  useEffect(() => {
    const syncAuth0User = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently()

          localStorage.setItem("jwtToken", token)

          const currentUser = {
            _id: user.sub,
            email: user.email,
            username: user.nickname || user.name,
            firstName: user.given_name || user.name?.split(" ")[0] || "",
            lastName: user.family_name || user.name?.split(" ").slice(1).join(" ") || "",
            events: [],
            hostedEvents: [],
            requestedEvents: [],
            pfp: user.picture,
          }

          dispatch(receiveCurrentUser(currentUser))
        } catch (error) {
          console.error("Error syncing Auth0 user:", error)
        }
      }
    }

    if (!isLoading) {
      syncAuth0User()
    }
  }, [isAuthenticated, user, isLoading, dispatch, getAccessTokenSilently])

  return null
}

export default Auth0Integration
