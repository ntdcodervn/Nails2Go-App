import AsyncStorage from '@react-native-community/async-storage';
export const BASE_URL_ROUTE = 'https://nail2go-server.herokuapp.com/';
export const langList = [
  {id: 'en', label: 'English'},
  {id: 'vi', label: 'Tiếng Việt'},
  {id: 'fr', label: 'French'},
  {id: 'ger', label: 'German'},
  {id: 'italy', label: 'Italian'},
  {id: 'spanish', label: 'Spanish'}
];
export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

export const getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    // error reading value
  }
};
