/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  createNewClient,
  getClientByID,
  updateClient,
} from "../services/api/useUser";
import useAlert from "./Alert/useAlert";
import { useNavigate } from "react-router-dom";

const ClientAdd = () => {
  const navigate = useNavigate();
  const { showAlert, Alert } = useAlert();
  const { id } = useParams();
  const initialValues = {
    name: "",
    address: "",
    client_type: "",
    status: "",
    contact_person: {
      aadhar_card: "",
      name: "",
      email: "",
      phone: "",
    },
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [clientData, setClientData] = useState();
  const clientType = [
    { key: 1, value: "Individual" },
    { key: 2, value: "Corporate" },
  ];
  const clientStatus = [
    { key: 0, value: "Inactive" },
    { key: 1, value: "Active" },
  ];
  const createClient = () => {
    createNewClient({
      status: Number(formValues.status),
      client_type: Number(formValues.client_type),
      address: formValues.address,
      name: formValues.name,
      contact_person: {
        aadhar_card: formValues.contact_person.aadhar_card,
        email: formValues.contact_person.email,
        name: formValues.contact_person.name,
        phone: formValues.contact_person.phone,
      },
    })
      .then(() => navigate("/clients"))
      .catch(() => showAlert("Oops! unable to create client!", "error", 8000));
  };
  const updateClientWithId = () => {
    const editedChanges = findChanges(clientData, formValues);
    updateClient(id, editedChanges)
      .then(() => navigate("/clients"))
      .catch(() => showAlert("Oops! unable to update client!", "error", 8000));
  };

  const findChanges = (original, updated) => {
    const changes = {};
    updated.client_type = Number(updated.client_type);
    updated.status = Number(updated.status);
    for (const key in updated) {
      const editedValue = updated[key];
      const originalValue = original[key];
      if (JSON.stringify(editedValue) !== JSON.stringify(originalValue)) {
        changes[key] = editedValue;
      }
    }
    return changes;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formValues };

    const keys = name.split("[").map((key) => key.replace("]", ""));
    let currentLevel = updatedFormData;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i === keys.length - 1) {
        currentLevel[key] = value;
      } else {
        currentLevel[key] = currentLevel[key] || {};
        currentLevel = currentLevel[key];
      }
    }
    setFormValues({ ...updatedFormData });
  };

  const handleStatusChange = (event) => {
    setFormValues({
      ...formValues,
      status: event.target.value,
    });
  };

  const handleTypeChange = (event) => {
    setFormValues({
      ...formValues,
      client_type: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (Object.keys(validate(formValues)).length) {
      setFormErrors(validate(formValues));
      return;
    }
    if (isEdit) {
      updateClientWithId();
    } else {
      createClient();
    }
  };
  const patchValue = (clientData) => {
    setClientData(clientData);
    const data = {
      name: clientData.name,
      address: clientData.address,
      client_type: clientData.client_type.toString(),
      status: clientData.status.toString(),
      contact_person: {
        aadhar_card: clientData.contact_person?.aadhar_card,
        email: clientData.contact_person?.email,
        name: clientData.contact_person?.name,
        phone: clientData.contact_person?.phone,
      },
    };
    setFormValues(data);
  };
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      getClientByID(id)
        .then((response) => patchValue(response.data))
        .catch(() => showAlert("Oops! unable to fetch client!", "error", 8000));
    }
  }, []);

  const validate = (values) => {
    const errors = {};
    const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/i;
    const aadharRegex = /^\d{12}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!values.address) {
      errors.clientAddress = "Address is required";
    }
    if (!values.contact_person.email) {
      errors.contactEmail = "Email is required";
    } else if (!emailRegex.test(values.contact_person.email)) {
      errors.contactEmail = "Email is not valid";
    }
    if (!values.contact_person.name) {
      errors.contactName = "Contact name is required";
    }
    if (!values.name) {
      errors.clientName = "Contact name is required";
    }
    if (!values.client_type) {
      errors.type = "Client type is required";
    }
    if (!values.status) {
      errors.status = "Client status is required";
    }
    if (!values.contact_person.phone) {
      errors.contactPhone = "Phone number is required";
    }
    if (
      values.contact_person.phone &&
      !phoneRegex.test(values.contact_person.phone)
    ) {
      errors.contactPhone = "Enter a valid phone number";
    }
    if (
      values.contact_person.aadhar_card &&
      !aadharRegex.test(values.contact_person.aadhar_card)
    ) {
      errors.aadharNumber = "Invalid Aadhar number";
    }
    return errors;
  };

  return (
    <>
      <div className="text-gray-700 text-500 font-bold mb-6">
        {isEdit ? "Edit" : "Create New"} Client
      </div>
      <form
        className=" !h-fit container mx-auto shadow-z1 p-8 rounded-2xl"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-2 mb-7 justify-between">
          <div className="flex-1">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium required-field text-gray-900 text-300 "
            >
              Client Name
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              required
            />
            <p className="text-red-400">{formErrors.clientName}</p>
          </div>
          <div className="flex-1">
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-medium required-field text-gray-900 text-300 "
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
              required
              name="address"
              value={formValues.address}
              onChange={handleChange}
            />
            <p className="text-red-400">{formErrors.clientAddress}</p>
          </div>
        </div>
        <div className="flex gap-2 mb-10 justify-between">
          <div className="flex-1">
            <label
              htmlFor="status"
              className="block mb-2 text-sm required-field font-medium text-gray-900 text-300 "
            >
              Client Status
            </label>
            <div className="flex">
              {clientStatus.map((option) => (
                <div className="flex items-center me-4" key={option.key}>
                  <input
                    type="radio"
                    required
                    name="status"
                    value={option.key}
                    className="w-4 h-4 text-gray-900 focus:ring-black ring-offset-gray-800 bg-white border-gray-600"
                    checked={
                      isEdit ? Number(formValues.status) === option.key : null
                    }
                    onChange={handleStatusChange}
                  />
                  <label
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    htmlFor={option.value}
                  >
                    {option.value}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-red-400">{formErrors.status}</p>
          </div>
          <div className="flex-1">
            <label
              htmlFor="client_type"
              className="block mb-2 text-sm required-field font-medium text-gray-900 text-300 "
            >
              Client Type
            </label>
            <div className="flex">
              {clientType.map((option) => (
                <div className="flex items-center me-4" key={option.key}>
                  <input
                    type="radio"
                    id={option.value}
                    name="client_type"
                    value={option.key}
                    className="w-4 h-4 text-gray-900 focus:ring-black ring-offset-gray-800 bg-white border-gray-600"
                    checked={Number(formValues.client_type) === option.key}
                    onChange={handleTypeChange}
                  />
                  <label
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    htmlFor={option.value}
                  >
                    {option.value}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-red-400">{formErrors.type}</p>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl mb-6">
          Contact person
          <div className="flex gap-2 mb-5 justify-between">
            <div className="flex-1">
              <label
                htmlFor="contact_person[name]"
                className="block mb-2 required-field text-sm font-medium text-gray-900 text-300 "
              >
                Name
              </label>
              <input
                type="text"
                name="contact_person[name]"
                value={formValues.contact_person.name}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                required
              />
              <p className="text-red-400">{formErrors.contactName}</p>
            </div>
            <div className="flex-1">
              <label
                htmlFor="contact_person[email]"
                className="block mb-2 text-sm required-field font-medium text-gray-900 text-300 "
              >
                Email
              </label>
              <input
                type="email"
                name="contact_person[email]"
                value={formValues.contact_person.email}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                required
              />
              <p className="text-red-400">{formErrors.contactEmail}</p>
            </div>
          </div>
          <div className="flex gap-2 mb-5 justify-between">
            <div className="flex-1">
              <label
                htmlFor="contact_person[aadhar_card]"
                className="block mb-2 text-sm font-medium text-gray-900 text-300 "
              >
                Aadhar card
              </label>
              <input
                type="text"
                maxLength={12}
                name="contact_person[aadhar_card]"
                value={formValues.contact_person.aadhar_card}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
              />
              <p className="text-red-400">{formErrors.aadharNumber}</p>
            </div>
            <div className="flex-1">
              <label
                htmlFor="contact_person[phone]"
                className="block mb-2 text-sm required-field font-medium text-gray-900 text-300 "
              >
                Phone
              </label>
              <input
                type="text"
                maxLength={10}
                name="contact_person[phone]"
                value={formValues.contact_person.phone}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                required
              />
              <p className="text-red-400">{formErrors.contactPhone}</p>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="text-white bg-black hover:bg-gray-800 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {!isEdit ? "Add" : "Update"} Client
        </button>
      </form>
      <Alert></Alert>
    </>
  );
};
export default ClientAdd;
