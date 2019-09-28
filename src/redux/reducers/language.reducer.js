import * as types from '../types';

var initialState = {
    language: 'en'
};

var languageReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.CHANGE_LANGUAGE: {
            return { language: action.language };
        }
        default:
            return state;
    }
};

export default languageReducer;