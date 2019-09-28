import * as types from '../types';

export const changeLanguage = language => {
  return {
    type: types.CHANGE_LANGUAGE,
    language,
  };
};