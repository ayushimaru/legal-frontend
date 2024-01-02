import Cookies from "js-cookie";
import { OpenAPI, LoginService, ClientService, CaseService, DocumentService, NoteService } from "../openapi";

const { postApiV1Client } = ClientService;
const {
  postApiV1Login,
  deleteApiV1Login,
  getApiV1ForgotPassword,
  postApiV1ResetPassword,
} = LoginService;
const { getApiV1Client, getApiV1Client1, putApiV1Client } = ClientService;
const { getApiV1Case, postApiV1Case, getApiV1Case1, putApiV1Case } = CaseService;
const { getApiV1Document, postApiV1Document, getApiV1AccessDocument, getApiV1Document1, putApiV1Document, deleteApiV1Document} = DocumentService;
const { getApiV1Note, postApiV1Note, putApiV1Note, deleteApiV1Note } = NoteService;

OpenAPI.BASE = "http://15.206.124.145";
const customerCode = window.sessionStorage.getItem("customerCode") || "";
const authToken = Cookies.get("authToken") || "";
const resetPwdToken = Cookies.get("resetPwdKey") || "";

export const loginUser = async (requestBody: any) => {
  try {
    const user = await postApiV1Login(requestBody);
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getClients = async () => {
  try {
    const customercode = window.sessionStorage.getItem("customerCode") || "";
    const data = await getApiV1Client(
      Cookies.get("authToken") || "",
      customercode
    );
    return data;
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
    const data = await deleteApiV1Login(authToken);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
//forgot password
export const forgotPassword = async (email: string) => {
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

// get all cases
export const getAllCases = async () => {
  try {
    const data = await getApiV1Case(
      Cookies.get("authToken") || "",
      window.sessionStorage.getItem("customerCode") || ""
    );
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
// add new case
export const addNewCase = async (requestBody: any) => {
  requestBody.customer_code = customerCode;
  try {
    await postApiV1Case(authToken, requestBody);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getCaseByID = async (id: any) => {
  try {
    const caseData = await getApiV1Case1(id, authToken);
    return caseData;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateCase = async (id: string, requestBody: any) => {
  try {
    const cases = await putApiV1Case(id, authToken, requestBody);
    return cases;
  } catch (error: any) {
    throw new Error(error);
  }
};

// get all cases
export const getAllDocuments = async (pageData: any) => {
  try {
    const perPage = pageData.perPage;
    const caseId= pageData.caseId || undefined;
    const addedBy= pageData.addedBy || undefined;
    const pageNumber = pageData.pageNumber;
    const data = await getApiV1Document(
      Cookies.get("authToken") || "",
      window.sessionStorage.getItem("customerCode") || "",
      caseId,
      addedBy,
      perPage,
      pageNumber,
    );
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const addNewDocument = async (formData: any) => {
  try {
    formData.customer_code = customerCode;
    const data = await postApiV1Document(authToken, formData);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getAccessDocument = async (id: any) => {
  try {
    const data = await getApiV1AccessDocument(id, authToken);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
export const getDocumentById = async (id: any) => {
  try {
    const data = await getApiV1Document1(id, authToken);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
export const updateDocumentById = async (id: any, formData: any) => {
  try {
    const data = await putApiV1Document(id, authToken, formData);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
export const deleteDocument = async (id: any) => {
  try {
    const data = await deleteApiV1Document(id, authToken);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
// get all notes
export const getAllNotes = async (pageData: any) => {
  try {
    const caseId= pageData.caseId;
    const data = await getApiV1Note(
      Cookies.get("authToken") || "",
      window.sessionStorage.getItem("customerCode") || "",
      caseId,
    );
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

// get all notes
export const updateNote = async (id: any, requestBody: any) => {
  try {
    const data = await putApiV1Note(id, authToken, requestBody);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
// deleteNote
export const deleteNote = async (id: any) => {
  try {
    const data = await deleteApiV1Note(id, authToken);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
// deleteNote
export const createNewNote = async (requestBody: any) => {
  try {
    requestBody.customer_code = customerCode;
    const data = await postApiV1Note(authToken, requestBody);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};