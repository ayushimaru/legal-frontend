import Cookies from 'js-cookie';
import {
    OpenAPI,
    LoginService,
    ClientService,
  } from '../openapi';
  
  const { postApiV1Client } = ClientService;
  const { postApiV1Login, deleteApiV1Login, getApiV1ForgotPassword, postApiV1ResetPassword } = LoginService;
  const { getApiV1Client, getApiV1Client1, putApiV1Client } = ClientService;
  
  OpenAPI.BASE = 'http://15.206.124.145';
  const customerCode = window.sessionStorage.getItem("customerCode") || '';
  const authToken = Cookies.get('authToken') || '';
  const resetPwdToken = Cookies.get('resetPwdKey') || '';

  export const loginUser = async (requestBody: any) => {
    console.log(requestBody);
        try {
          const user = await postApiV1Login(requestBody);
          return user;
        } catch (error: any) {
          throw new Error(error);
        }
    };

    export const getClients = async () => {
        try {
        const customercode = window.sessionStorage.getItem("customerCode") || '';
        const data = await getApiV1Client(Cookies.get('authToken') || '', customercode);
        return data
        } catch (error: any) {
        throw new Error(error);
        }
    };
    export const createNewClient = async (requestBody: any) => {
      try {
      requestBody.customer_code = customerCode;
      const client = await postApiV1Client(authToken, requestBody);
      return client;
      } catch (error: any) {
      throw new Error(error);
      }
  };
  export const updateClient = async (id: string, requestBody: any) => {
    try {
    requestBody.customer_code = customerCode;
    const client = await putApiV1Client(id, authToken, requestBody);
    return client;
    } catch (error: any) {
    throw new Error(error);
    }
};
  export const getClientByID = async (id: any) => {
    try {
    const clientData = await getApiV1Client1(id, authToken);
    return clientData;
    } catch (error: any) {
    throw new Error(error);
    }
};

//Logout User
export const logoutUserApi = async () => {
  try {
  console.log(authToken);
  const data = await deleteApiV1Login(authToken);
  return data;
  } catch (error: any) {
  throw new Error(error);
  }
};
//forgot password
export const forgotPassword = async (email: string) => {
  console.log(email);
  try {
  const data = await getApiV1ForgotPassword(email);
  return data;
  } catch (error: any) {
  throw new Error(error);
  }
};
//reset password
export const resetPassword = async (requestBody: any) => {
  try {
  requestBody.key = resetPwdToken;
  const data = await postApiV1ResetPassword(requestBody);
  return data;
  } catch (error: any) {
  throw new Error(error);
  }
};