/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  addNewDocument,
  getDocumentById,
  getAllCases,
  updateDocumentById,
} from "../../services/api/useUser";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const DocumentAdd = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const initialValues = {
    title: "",
    note: "",
    case_id: "",
    document: "",
    file_url: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [casesList, setCasesList] = useState();
  const [docData, setDocData] = useState();
  const fileInputRef = useRef(null);
  const caseId = state?.id;

  const createDocument = () => {
    addNewDocument({
      case_id: caseId ? caseId : formValues.case_id,
      document: formValues.document,
      note: formValues.note,
      title: formValues.title,
    })
      .then(() =>
        caseId ? navigate(`/caseData/${caseId}`) : navigate("/documents")
      )
      .catch((error) => "");
  };
  const updateDocumentWithId = () => {
    const editedChanges = findChanges(docData, formValues);
    updateDocumentById(id, editedChanges)
      .then(() =>
        caseId ? navigate(`/caseData/${caseId}`) : navigate("/documents")
      )
      .catch((error) => "");
  };

  const findChanges = (original, updated) => {
    const changes = {};
    for (const key in updated) {
      if (key !== "file_url") {
        const editedValue = updated[key];
        const originalValue = original[key];
        if (JSON.stringify(editedValue) !== JSON.stringify(originalValue)) {
          changes[key] = editedValue;
        }
      }
    }
    return changes;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const getCasesList = async () => {
    await getAllCases()
      .then((response) => setCasesList(response.data))
      .catch(() => "");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (Object.keys(validate(formValues)).length) {
      setFormErrors(validate(formValues));
      return;
    }
    if (isEdit) {
      updateDocumentWithId();
    } else {
      createDocument();
    }
  };
  const patchValue = (docData) => {
    const file = docData.file_url.replace(/^.*[\\/]/, "");
    setDocData(docData);
    const data = {
      title: docData.title,
      note: docData.note,
      case_id: docData.case_id,
      file_url: file,
    };
    setFormValues(data);
  };
  useEffect(() => {
    getCasesList();
    if (id) {
      setIsEdit(true);
      getDocumentById(id)
        .then((response) => patchValue(response.data))
        .catch((error) => "");
    }
  }, []);

  const validate = (values) => {
    const errors = {};
    if (!values.title) {
      errors.title = "Document title is required";
    }
    if (!isEdit && !values.document) {
      errors.file = "Document is required";
    }
    if (!caseId && !values.case_id) {
      errors.case_id = "Please select case";
    }
    return errors;
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    formValues["document"] = selectedFile;
  };
  const handleFileChangeTwo = (e) => {
    setIsFileUpload(true);
    const selectedFile = e.target.files[0];
    formValues["document"] = selectedFile;
  };

  return (
    <>
      <div className="text-gray-700 text-500 font-bold mb-6">
        {isEdit ? "Edit" : "Create New"} Document
      </div>
      <form
        className=" !h-fit container mx-auto shadow-z1 p-8 rounded-2xl"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-2 mb-7 justify-between">
          <div className="flex-1">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900 text-300 "
            >
              Title
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              required
            />
            <p className="text-red-400">{formErrors.title}</p>
          </div>
          <div className="flex-1">
            <label
              htmlFor="note"
              className="block mb-2 text-sm font-medium text-gray-900 text-300 "
            >
              Note
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
              name="note"
              value={formValues.note}
              onChange={handleChange}
            />
            <p className="text-red-400">{formErrors.note}</p>
          </div>
        </div>
        {!caseId && (
          <div className="flex gap-2 mb-10 justify-between">
            <div className="flex-1">
              <label
                htmlFor="case_id"
                className="block mb-2 text-sm font-medium text-gray-900 text-300 "
              >
                Case
              </label>
              <div className="flex">
                <select
                  name="case_id"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg  block w-full p-2.5 focus:ring-black focus:border-black"
                  value={formValues.case_id}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select Case
                  </option>
                  {casesList?.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.title}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-red-400">{formErrors.case_id}</p>
            </div>
          </div>
        )}
        {!isEdit && (
          <div className="w-full mb-8">
            <label
              className="block mb-2 text-gray-900 text-300 font-medium text-black"
              htmlFor="document"
            >
              Upload file
            </label>
            <input
              className="block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="document"
              name="document"
              type="file"
              onChange={handleFileChange}
            />
            <p className="text-red-400">{formErrors.document}</p>
          </div>
        )}
        {isEdit && (
          <div className="w-full mb-8">
            <label
              className="block mb-2 text-gray-900 text-300 font-medium text-black"
              htmlFor="file_url"
            >
              Document
            </label>
            <div className="flex gap-6">
              <input
                className="flex-1 block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id={isFileUpload ? "document" : "file_url"}
                name={isFileUpload ? "document" : "file_url"}
                type="text"
                readOnly={isFileUpload ? false : true}
                value={
                  isFileUpload ? formValues.document?.name : formValues.file_url
                }
              />
              <input
                type="file"
                id="fileInput"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChangeTwo}
              />
              <label htmlFor="fileInput" id="uploadButton">
                <UploadOutlined className="flex-1" />
              </label>
            </div>
            <p className="text-red-400">{formErrors.document}</p>
          </div>
        )}

        <button
          type="submit"
          className="text-white bg-black hover:bg-gray-800 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {!isEdit ? "Add" : "Update"} Document
        </button>
      </form>
    </>
  );
};
export default DocumentAdd;
