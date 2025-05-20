import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createJoinRequest, fetchEvent } from "../../../store/events";
import { deleteJoinRequest } from "../../../store/events";
import { addEventJoin, fetchUser, getPendingAttendees, getUser, receiveUser } from "../../../store/users";
import "./index.css";
import ExchangeConnections from "../ExchangeConnections";

const Notification = ({ event, dataSanitizedUniqueConnections, user, currentUser }) => {
  const dispatch = useDispatch();

  const handleAccept = async (e) => {
    // deleting join request, adding user to event
    await dispatch(addEventJoin(e.target.value, event._id));
    await dispatch(deleteJoinRequest(event._id, e.target.value));
  };
  
  const handleDelete = (e) => {
    // deleting join request
    dispatch(deleteJoinRequest(event._id, e.target.value));
  };

  const users = useSelector(getPendingAttendees(event));
  
  // useEffect(() => {
  //     console.log("Fetching event:", event?._id);
  //   dispatch(fetchEvent(event?._id));
  // }, [dispatch, event?._id]);

  return (
    <>
      {users.length > 0 && (
        users.map(user => {
          return (
            <div className="notification-container" key={user?._id}>
              <div className="title-user">
                <div className="event-title">{event?.title}</div>
                <div className="pending-user">{user?.username}</div>
              </div>
              <div className="btns-container">
                <button
                  value={user?._id}
                  onClick={handleAccept}
                  className="handle-accept"
                >
                  Accept
                </button>
                <button
                  value={user?._id}
                  onClick={handleDelete}
                  className="handle-delete"
                >
                  Deny
                </button>
              </div>
            </div>
          )
        })
      // ) : (
          // <ExchangeConnections
          //   dataSanitizedUniqueConnections={dataSanitizedUniqueConnections}
          //   user={user}
          //   currentUser={currentUser}
          // />
      )}
    </>
  );
}

export default Notification