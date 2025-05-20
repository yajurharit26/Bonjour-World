import React from 'react'
import { Link } from 'react-router-dom';

const ExchangeConnections= ({ dataSanitizedUniqueConnections, user, currentUser }) => {
  return (
    <>
      <h2 id="notifications-title">Exchange Connections</h2>
      <div className="exchange-connections-div">
        {dataSanitizedUniqueConnections.map((attendee) => {
          return attendee?._id !== user?._id &&
            attendee?._id !== currentUser?._id && (
            <div className="attendee-details" key={attendee._id}>
              <Link
                to={`/profile/${attendee?._id}`}
                key={attendee?.id}
              >
                <img
                  className="attendee-pfp"
                  src={attendee?.pfp}
                  alt={attendee?.username}
                />
              </Link>
              <span className="attendee-username">
                {attendee?.username}
              </span>
            </div>
        )})}
      </div>
    </>
  )
}

export default ExchangeConnections