import {combineReducers} from 'redux';
import languageReducer from './language.reducer';
import serviceReducer from './serviceReducer';
import cartReducer from './cartReducer';
import orderReducer from './orderReducer';
export default combineReducers({
  services: serviceReducer,
  cart: cartReducer,
  order: orderReducer,
  languageReducer,
});
