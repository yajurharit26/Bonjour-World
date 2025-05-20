import { Auth0Provider } from "@auth0/auth0-react"

const Auth0ProviderWrapper = ({ children }) => {
  return (
    <Auth0Provider
      domain="dev-wjkyy82v6upryoe8.us.auth0.com"
      clientId="MqNLxEfcWRyLA5TjqQLTzMUymT718e4J"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE || "https://api.bonjourworld.com",
        scope: "openid profile email",
      }}
    >
      {children}
    </Auth0Provider>
  )
}

export default Auth0ProviderWrapper
