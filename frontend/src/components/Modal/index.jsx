import { closeModal } from "../../store/modal";
import LoginForm from "../SessionForms/LoginForm/LoginForm";
import SignupForm from "../SessionForms/SignupForm/SignupForm";
import OTPVerificationForm from "../SessionForms/OTPVerificationForm/OTPVerificationForm";
import EventForm from "../Event/EventForm";
import EventUpdateForm from "../Event/EventUpdateForm";
import "./modal.css";
import { useDispatch, useSelector } from "react-redux";
import UserSettings from "../UserSettings";

const Modal = () => {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal?.modal);
  const eventId = useSelector((state) => state.modal?.eventId);

  if (!modal) {
    return null;
  }

  let component;
  let modalClass;

  switch (modal) {
    case "login":
      component = <LoginForm modal={"null"} />;
      modalClass = "login-modal";
      break;
    case "signup":
      component = <SignupForm modal={"null"} />;
      modalClass = "signup-modal";
      break;
    case "otp":
      component = <OTPVerificationForm modal={"null"} />;
      modalClass = "otp-modal";
      break;
    case "createEvent":
      component = <EventForm modal={"null"} />;
      modalClass = "create-event-modal";
      break;
    case "updateEvent":
      component = <EventUpdateForm eventId={eventId} modal={"null"} />;
      modalClass = "update-event-modal";
      break;
    case "updateSettings":
      component = <UserSettings modal={"null"} />;
      modalClass = "update-user-modal";
      break;
    default:
      return null;
  }

  return (
    <div className="modal-background" onClick={() => dispatch(closeModal())}>
      <div className={modalClass} onClick={(e) => e.stopPropagation()}>
        {component}
      </div>
    </div>
  );
};

export default Modal;