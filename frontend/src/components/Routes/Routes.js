import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

// routes that should only be accessible when the user is not logged in
export const AuthRoute = ({ component: Component, path, exact }) => {
  const loggedIn = useSelector((state) => !!state.session.user);

  return (
    <Route
      path={path}
      exact={exact}
      render={
        (props) =>
          // If not logged in, render the specified component; otherwise, redirect to "/events"
          !loggedIn ? <Component {...props} /> : <Redirect to="/events" /> 
      }
    />
  );
};

// routes that require the user to be logged in
export const ProtectedRoute = ({ component: Component, ...rest }) => {
  const loggedIn = useSelector((state) => !!state.session.user);

  return (
    <Route
      {...rest}
      render={(props) =>
        // If logged in, render the specified component; otherwise, redirect to "/login"
        loggedIn ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};