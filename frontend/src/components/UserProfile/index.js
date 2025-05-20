// import { getCurrentUser } from "../../store/session";
// import EmptyUser from "../Images/EmptyUser.png";
// import EventsMapWrapper from "../EventMap";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect } from "react-router-dom";
import "./index.css";
import EventIndexItem from "../Event/EventIndexItem";
import {
  fetchEvents,
  getRelevantEvents,
  getHostedEvents,
} from "../../store/events";
import Notification from "./Notification/index.js";
import {
  fetchUsers,
  fetchUser,
  getConnections,
  getUser,
  updateUser,
} from "../../store/users.js";
import { ReactComponent as EditIcon } from "../../static/images/pen.svg";
import ExchangeConnections from "./ExchangeConnections/index.jsx";
import { openModal } from "../../store/modal.js";

const UserProfile = () => {
  const dispatch = useDispatch();

  // get profile user
  const { id } = useParams();
  const user = useSelector(getUser(id));

  // update bio
  const [isEditMode, setIsEditMode] = useState(false);
  const [newBio, setNewBio] = useState(user?.bio);

  useEffect(() => {
    setNewBio(user?.bio);
  }, [user?.bio]);

  const updateBio = () => {
    const updatedUser = { ...user, bio: newBio };
    dispatch(updateUser(updatedUser));
    setIsEditMode(false);
  };

  const handleEditBtnClick = () => {
    setIsEditMode((prev) => !prev);
    setNewBio(user?.bio);
  };

  // get current user
  const currentUser = useSelector((state) => state.session.user);

  // const [uploadedImage, setUploadedImage] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  // get all events user is attending
  const events = useSelector(getRelevantEvents(user?._id));

  // get all hosted events for current user
  const hostedEvents = useSelector(getHostedEvents(user?._id));

  // get user connections
  const connections = useSelector(getConnections(events));
  const uniqueConnections = new Set(connections);
  const dataSanitizedUniqueConnections = [...uniqueConnections];

  const [highlightedEvent, setHighlightedEvent] = useState();
  // const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchUsers());
    dispatch(fetchUser(id));
  }, [dispatch, id]);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const currentUserData = await getCurrentUser();
  //       let profileImageUrl = currentUserData.profileImageUrl;

  //       if (!profileImageUrl) {
  //         const params = {
  //           Bucket: "bonjour-world",
  //           Prefix: `user/${user?._id}/`,
  //         };

  //         const data = await S3.listObjectsV2(params).promise();

  //         const mostRecentImage = data.Contents[0];

  //         if (mostRecentImage) {
  //           profileImageUrl = S3.getSignedUrl("getObject", {
  //             Bucket: "bonjour-world",
  //             Key: mostRecentImage.Key,
  //           });
  //         }
  //       }

  //       setUploadedImage(profileImageUrl || EmptyUser);
  //     } catch (error) {
  //       console.error("Error fetching user data", error);
  //     }
  //   };

  //   dispatch(fetchEvents());
  //   fetchUserData();
  //   setFadeIn(true);
  // }, []);

  // const handleImageChange = async (event) => {
  //   const selectedImage = event.target.files[0];

  //   if (selectedImage) {
  //     const params = {
  //       Bucket: "bonjour-world",
  //       Key: `user/${user?._id}/${selectedImage.name}`,
  //       Body: selectedImage,
  //       ACL: "public-read",
  //     };

  //     try {
  //       console.log("Upload params:", params);
  //       const data = await S3.upload(params).promise();
  //       console.log("Upload successful:", data);
  //       setUploadedImage(data.Location);
  //     } catch (error) {
  //       console.error("Error uploading image to S3:", error);
  //     }
  //   }
  // };

  // const handleImageLoad = () => {
  //   setImageLoaded(true);
  // };

  // const markerEventHandlers = {
  //   click: (event) => {
  //     history.push(`/events/${event._id}`);
  //   },
  //   mouseover: (event) => {
  //     setHighlightedEvent(event);
  //   },
  //   mouseout: () => {
  //     setHighlightedEvent(null);
  //   },
  // };

  if (!currentUser) return <Redirect to="/" />;

  return (
    <div className={`app-container ${fadeIn ? "fade-in" : ""}`}>
      <div className={`profile-container ${fadeIn ? "fade-in" : ""}`}>
        <div className={`actual-profile-container ${fadeIn ? "fade-in" : ""}`}>
          <div id="left-side">
            <div id="left-side-top">
              {user?._id === currentUser?._id
                ? `Hello, ${user?.firstName} ${user?.lastName}`
                : `${user?.firstName} ${user?.lastName}`}
            </div>
            <div id="left-side-bottom">
              <div className="profile-details">
                <div className="profile-img-container">
                  <img
                    className={`profile-img visible`}
                    src={user?.pfp}
                    alt=""
                  />
                  {/* {!imageLoaded && (
                      <div className="loading-spinner">Loading...</div>
                    )} */}
                  {/* <label htmlFor="imageInput" className="upload-label">
                      Upload Image
                      <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                      />
                    </label> */}
                </div>
                <div id="profile-details-banner">
                  <div>Bio</div>
                  {user?._id === currentUser?._id && (
                    <div className="edit-bio-btns-div">
                      {isEditMode && (
                        <button onClick={() => updateBio()}>Save</button>
                      )}
                      <EditIcon onClick={handleEditBtnClick} />
                    </div>
                  )}
                </div>

                {isEditMode ? (
                  <textarea
                    onChange={(e) => setNewBio(e.target.value)}
                    value={newBio}
                    autoFocus
                  ></textarea>
                ) : (
                  <div className="profile-detail">{newBio}</div>
                )}
                <div id="profile-details-banner">
                  <div>Languages</div>
                  {user?._id === currentUser?._id && (
                    <div className="edit-lang-btns-div">
                      <EditIcon
                        onClick={() => dispatch(openModal("updateSettings"))}
                      />
                    </div>
                  )}
                </div>
                <div className="profile-detail">
                  {user?.languages.join(", ")}
                </div>
              </div>

              <div className="notifications-div">
                {user?._id === currentUser?._id ? (
                  <div>
                    <h2 id="notifications-title">Pending Requests</h2>
                    <div className="pending-div">
                      {hostedEvents.length > 0 ? (
                        hostedEvents.map((event) => (
                          <Notification
                            key={event._id}
                            event={event}
                            dataSanitizedUniqueConnections={
                              dataSanitizedUniqueConnections
                            }
                            user={user}
                            currentUser={currentUser}
                          />
                        ))
                      ) : (
                        <p>Nothing to see here... yet.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <ExchangeConnections
                      dataSanitizedUniqueConnections={
                        dataSanitizedUniqueConnections
                      }
                      user={user}
                      currentUser={currentUser}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="event-container">
            <h2 className="event-header">
              {user?._id === currentUser?._id
                ? "Your Exchanges"
                : `${user?.firstName}'s Exchanges`}
            </h2>
            <div className="display-users-events">
              {events?.length > 0 ? (
                events?.map((event) => (
                  <EventIndexItem
                    key={event._id}
                    event={event}
                    highlightedEvent={highlightedEvent}
                    setHighlightedEvent={setHighlightedEvent}
                  />
                ))
              ) : (
                <p className="no-events">Nothing to see here... yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
