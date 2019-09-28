import {FETCH_PRODUCTS} from '../types';
import {getServices} from '../../utils/api';

export const fetchServices = () => async dispatch => {
  var token = await getData('token');
  const services = await getServices(token);
  dispatch({
    type: FETCH_PRODUCTS,
    payload: services,
  });
};
