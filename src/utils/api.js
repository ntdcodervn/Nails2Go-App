import axios from 'axios';

export const addCart = async (token, idService, url) => {
  try {
    var data = await axios({
      url: url,
      method: 'POST',
      data: {
        idService: idService,
      },
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getServicesInCart = async token => {
  try {
    var response = await axios({
      url: 'https://nail2go-server.herokuapp.com/api/cart/getCartByIdUser',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });
    return response.data.cart.services;
  } catch (error) {}
};

export const postBooking = async (token,idServices,idSlot) => {
  try {
    var response = await axios({
      url: 'https://nail2go-server.herokuapp.com/api/booking/booking',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      data: {
        idService: idServices,
        idSlot : idSlot
      },
    });
    return response.data;
  } catch (error) {}
};

export const getServices = async token => {
  try {
    var response = await axios({
      url: 'https://nail2go-server.herokuapp.com/api/service/getAllServices',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });
    return response.data.listServices;
  } catch (error) {}
};

export const getUserInfo = async token => {
  try {
    var data = await axios({
      url: `https://nail2go-server.herokuapp.com/api/users/getDataUser`,
      method: 'GET',
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
    });
    return data.data;
  } catch (error) {
    console.log(error);
  }
};
export const changeName = async (firstName, lastName, token) => {
  try {
    var data = await axios({
      url: `https://nail2go-server.herokuapp.com/api/users/editName`,
      method: 'POST',
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
      data: {
        firstName,
        lastName,
      },
    });
    return data.data;
  } catch (error) {
    console.log(error);
  }
};
