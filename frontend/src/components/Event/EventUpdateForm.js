import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./EventForm.css";
import {
  getEvent,
  fetchEvent,
  updateEvent,
  clearEventErrors,
} from "../../store/events";
import { closeModal } from "../../store/modal";

const EventUpdateForm = ({ eventId }) => {
  const errors = useSelector((state) => state.errors.event);
  const history = useHistory();
  let event = useSelector(getEvent(eventId));

  const [title, setTitle] = useState(event?.title);
  const [description, setDescription] = useState(event?.description);
  const [languages, setLanguages] = useState(event?.languages);
  const [address, setAddress] = useState(event?.address);
  const [date, setDate] = useState(event?.date);
  const [time, setTime] = useState(event?.time);
  const [endTime, setEndTime] = useState(event?.endTime);

  const dispatch = useDispatch();

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEvent(eventId));
    }
    if (event) {
      const newDate = formatDate(new Date(date));
      setDate(newDate);
    }
  }, [eventId]);

  useEffect(() => {
    return () => dispatch(clearEventErrors());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedEvent = {
      ...event,
      title,
      description,
      languages,
      address,
      date,
      time,
      endTime,
    };
    
    const res = await dispatch(updateEvent(updatedEvent));
    if (res.ok) {
      dispatch(closeModal());
      history.push(`/events/${eventId}`);
    }
  };

  const formatDate = (inputDate) => {
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(inputDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const update = (field) => {
    return (e) => {
      switch (field) {
        case "title":
          setTitle(e.currentTarget.value);
          break;
        case "description":
          setDescription(e.currentTarget.value);
          break;
        case "language":
          setLanguages(e.currentTarget.value);
          break;
        case "address":
          setAddress(e.currentTarget.value);
          break;
        case "date":
          setDate(new Date(e.target.value));
          break;
        case "time":
          setTime(e.currentTarget.value);
          break;
        case "endTime":
          setEndTime(e.currentTarget.value);
          break;
        default:
          console.error("Field name error");
          break;
      }
    };
  };

  const firstSix = [
    "Arabic",
    "English",
    "French",
    "German",
    "Hindi",
    "Japanese",
  ];

  const lastSix = [
    "Korean",
    "Mandarin",
    "Portugese",
    "Russian",
    "Spanish",
    "Swahili",
  ];

  const addLanguage = (lang) => (e) => {
    setLanguages([...languages, lang]);
  };

  const removeLanguage = (lang) => (e) => {
    setLanguages(languages.filter((val) => val !== lang));
  };

  const generateTimeOptions = () => {
    const timeOptions = [];
    const interval = 15;

    for (let hour = 7; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const formattedTime = `${formattedHour}:${formattedMinute}`;
        timeOptions.push(
          time === formattedTime ? (
            <option key={formattedTime} value={formattedTime} selected>
              {formattedTime}
            </option>
          ) : (
            <option key={formattedTime} value={formattedTime}>
              {formattedTime}
            </option>
          )
        );
      }
    }

    return timeOptions;
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <h2>Edit Your Exchange</h2>

      <div className="selects">
        <div className="select">
          <div className="time-select">
            <select value={time} onChange={update("time")}>
              <option disabled value="">
                Start Time
              </option>
              {generateTimeOptions()}
            </select>
          </div>

          <div className="time-select">
            <select value={endTime} onChange={update("endTime")}>
              <option disabled value="">
                End Time
              </option>
              {generateTimeOptions()}
            </select>
          </div>
          <div className="errors time-error">{errors?.time}</div>
        </div>
      </div>

      <div className="select">
        <div className="languages-container">
          <div className="errors lang-error">{errors?.languages}</div>
          <div className="top-language-container">
            {firstSix.map((lang) => {
              return languages?.includes(lang) ? (
                <div
                  className="event-unselect-btn lang-btn"
                  key={lang}
                  onClick={removeLanguage(lang)}
                >
                  <div>{lang}</div>
                  <div className="x-button">&times;</div>
                </div>
              ) : (
                <div
                  className="event-select-btn lang-btn"
                  key={lang}
                  onClick={addLanguage(lang)}
                >
                  <span>{lang}</span>
                </div>
              );
            })}
          </div>
          <div className="bottom-language-container">
            {lastSix.map((lang) => {
              return languages?.includes(lang) ? (
                <div
                  className="event-unselect-btn lang-btn"
                  key={lang}
                  onClick={removeLanguage(lang)}
                >
                  <div>{lang}</div>
                  <div className="x-button">&times;</div>
                </div>
              ) : (
                <div
                  className="event-select-btn lang-btn"
                  key={lang}
                  onClick={addLanguage(lang)}
                >
                  <span>{lang}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="inputs">
        <div className="left-column">
          <div className="title-error errors">{errors?.title}</div>
          <input
            type="text"
            value={title}
            placeholder="Title"
            onChange={update("title")}
          />

          <div className="date-error errors">{errors?.date}</div>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />

          <div className="errors">{errors?.address}</div>
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={update("address")}
          />
        </div>
      </div>

      <div className="description-error errors">{errors?.description}</div>
      <textarea
        placeholder="Description"
        value={description}
        onChange={update("description")}
      />

      <input type="submit" value="Update Exchange" />
    </form>
  );
};

export default EventUpdateForm;
