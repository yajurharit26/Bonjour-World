import React from "react";
import "./EventIndexItem.css";
import { useHistory } from "react-router-dom";
import { EG, US, FR, DE, ES, IN, JP, KR, CN, BR, RU, TZ } from "country-flag-icons/react/3x2";
import { useSelector } from "react-redux";
import { getHost, getUser } from "../../store/users";

const EventIndexItem = ({ event, setHighlightedEvent }) => {
  const history = useHistory();
  const host = useSelector(getHost(event));

  const redirectShow = () => {
    history.push(`/events/${event._id}`);
  };

  const handleMouseOver = () => {
    setHighlightedEvent(event);
  };

  const handleMouseOut = () => {
    setHighlightedEvent(null);
  };

  // const formatDate = (originalDate) => {
  //   const dateObject = new Date(originalDate);
  //   const year = dateObject.getFullYear();
  //   const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  //   const day = String(dateObject.getDate()).padStart(2, "0");

  //   return `${month}-${day}-${year}`;
  // };

  function formatDate(originalDate) {
    const options = { month: "long", day: "numeric", year: "numeric" };
    return new Date(originalDate).toLocaleDateString(undefined, options);
  }

  const getStateAbbreviation = (stateFullName) => {
    const stateMap = {
      Alabama: "AL",
      Alaska: "AK",
      Arizona: "AZ",
      Arkansas: "AR",
      California: "CA",
      Colorado: "CO",
      Connecticut: "CT",
      Delaware: "DE",
      Florida: "FL",
      Georgia: "GA",
      Hawaii: "HI",
      Idaho: "ID",
      Illinois: "IL",
      Indiana: "IN",
      Iowa: "IA",
      Kansas: "KS",
      Kentucky: "KY",
      Louisiana: "LA",
      Maine: "ME",
      Maryland: "MD",
      Massachusetts: "MA",
      Michigan: "MI",
      Minnesota: "MN",
      Mississippi: "MS",
      Missouri: "MO",
      Montana: "MT",
      Nebraska: "NE",
      Nevada: "NV",
      "New Hampshire": "NH",
      "New Jersey": "NJ",
      "New Mexico": "NM",
      "New York": "NY",
      "North Carolina": "NC",
      "North Dakota": "ND",
      Ohio: "OH",
      Oklahoma: "OK",
      Oregon: "OR",
      Pennsylvania: "PA",
      "Rhode Island": "RI",
      "South Carolina": "SC",
      "South Dakota": "SD",
      Tennessee: "TN",
      Texas: "TX",
      Utah: "UT",
      Vermont: "VT",
      Virginia: "VA",
      Washington: "WA",
      "West Virginia": "WV",
      Wisconsin: "WI",
      Wyoming: "WY",
    };

    return stateMap[stateFullName] || stateFullName;
  };

  return (
    <div
      id="event-item"
      onClick={redirectShow}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div id="event-item-title">
        <div id="event-title">{event.title}</div>
      </div>

      <div className="attendees-flags">
        <div id="event-item-attendees">
          Number Of Attendees: {event.attendees.length}
        </div>
        <div className="flags">
          {event.languages?.includes("English") && <US className="flag" />}
          {event.languages?.includes("French") && <FR className="flag" />}
          {event.languages?.includes("German") && <DE className="flag" />}
          {event.languages?.includes("Spanish") && <ES className="flag" />}
          {event.languages?.includes("Hindi") && <IN className="flag" />}
          {event.languages?.includes("Japanese") && <JP className="flag" />}
          {event.languages?.includes("Korean") && <KR className="flag" />}
          {event.languages?.includes("Mandarin") && <CN className="flag" />}
          {event.languages?.includes("Portugese") && <BR className="flag" />}
          {event.languages?.includes("Russian") && <RU className="flag" />}
          {event.languages?.includes("Arabic") && <EG className="flag" />}
          {event.languages?.includes("Swahili") && <TZ className="flag" />}
        </div>
      </div>

      {/* <div id="item-location-div">
        <div id="event-item-city">{event.city}</div>
        <div id="event-item-state">{getStateAbbreviation(event.state)}</div>
      </div> */}

      <div id="event-item-bottom">
        <div id="date-item-and-time">
          <div id="event-item-date">{formatDate(event.date)}</div>
          <div id="times-container">
            {event.time} - {event.endTime}
          </div>
          {/* <div id="event-item-zipcode">{event.zipcode}</div> */}
        </div>
      </div>
    </div>
  );
};

export default EventIndexItem;
