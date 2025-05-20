// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { Switch, Route } from "react-router-dom";
// import { getCurrentUser } from "./store/session";
// import Modal from "./components/Modal";
// import EventIndex from "./components/Event/EventIndex";
// import EventShow from "./components/Event/EventShow";
// import UserProfile from "./components/UserProfile";
// import AboutUs from "./components/AboutUs";
// import MainPage from "./components/MainPage";
// import NavBar from "./components/NavBar";
// import PageNotFound from "./components/PageNotFound";

// const App = () => {
//   const [loaded, setLoaded] = useState(false);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(getCurrentUser()).then(() => setLoaded(true));
//   }, [dispatch]);

//   return (
//     <>
//       {loaded && (
//         <Switch>
//           <Route exact path="/">
//             <NavBar />
//             <MainPage />
//           </Route>
//           <Route exact path="/aboutus">
//             <NavBar />
//             <AboutUs />
//           </Route>
//           <Route exact path="/events">
//             <NavBar />
//             <EventIndex />
//           </Route>
//           <Route exact path="/events/:eventId">
//             <NavBar />
//             <EventShow />
//           </Route>
//           <Route exact path="/profile/:id">
//             <NavBar />
//             <UserProfile />
//           </Route>
//           <Route path="page-not-found">
//             <PageNotFound />
//           </Route>
//           <Route>
//             <PageNotFound />
//           </Route>
//         </Switch>
//       )}
//       <Modal />
//     </>
//   );
// };

// export default App;



"use client"

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Switch, Route } from "react-router-dom"
import { getCurrentUser } from "./store/session"
import Modal from "./components/Modal"
import EventIndex from "./components/Event/EventIndex"
import EventShow from "./components/Event/EventShow"
import UserProfile from "./components/UserProfile"
import AboutUs from "./components/AboutUs"
import MainPage from "./components/MainPage"
import NavBar from "./components/NavBar"
import PageNotFound from "./components/PageNotFound"
import Auth0Integration from "./components/Auth0/Auth0Integration"

const App = () => {
  const [loaded, setLoaded] = useState(false)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getCurrentUser()).then(() => setLoaded(true))
  }, [dispatch])

  return (
    <>
      {/* Auth0 Integration Component */}
      <Auth0Integration />

      {loaded && (
        <Switch>
          <Route exact path="/">
            <NavBar />
            <MainPage />
          </Route>
          <Route exact path="/aboutus">
            <NavBar />
            <AboutUs />
          </Route>
          <Route exact path="/events">
            <NavBar />
            <EventIndex />
          </Route>
          <Route exact path="/events/:eventId">
            <NavBar />
            <EventShow />
          </Route>
          <Route exact path="/profile/:id">
            <NavBar />
            <UserProfile />
          </Route>
          <Route path="page-not-found">
            <PageNotFound />
          </Route>
          <Route>
            <PageNotFound />
          </Route>
        </Switch>
      )}
      <Modal />
    </>
  )
}

export default App
