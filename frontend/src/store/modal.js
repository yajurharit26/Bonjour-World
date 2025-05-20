export const OPEN_MODAL = "OPEN_MODAL";
export const CLOSE_MODAL = "CLOSE_MODAL";
export const UPDATE_EVENT = "UPDATE_EVENT";
export const UPDATE_SETTINGS = "UPDATE_SETTINGS";

export const openModal = (modal) => ({
  type: OPEN_MODAL,
  modal,
});

export const closeModal = () => ({
  type: CLOSE_MODAL,
});

export const updateEvent = (modal, eventId) => ({
  type: UPDATE_EVENT,
  modal,
  eventId
})

export const updateSettings = (modal, userId) => ({
  type: UPDATE_SETTINGS,
  modal,
  userId,
});

const modalReducer = (state = {}, action) => {
  const newState = {...state}

  switch (action.type) {
    case "OPEN_MODAL":
      newState["modal"] = action.modal;
      return newState;
    case "UPDATE_EVENT":
      return { modal: action.modal, eventId: action.eventId };
    case "UPDATE_SETTINGS":
      return { modal: action.modal, userId: action.userId };
    case "CLOSE_MODAL":
      newState["modal"] = null;
      return newState;
    default:
      return state;
  }
};

export default modalReducer;