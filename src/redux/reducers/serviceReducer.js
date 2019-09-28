import {FETCH_SERVICES} from '../types';
const initialState = {
  items: [],
};
export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_SERVICES:
      return {
        ...state,
        items: action.payload,
      };
    default:
      return state;
  }
}
