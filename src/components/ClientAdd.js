/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  createNewClient,
  getClientByID,
  updateClient,
} from "../services/api/useUser";
import { useNavigate } from "react-router-dom";

const ClientAdd = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const initialValues = {
    clientName: "",
    clientAddress: "",
    type: "",
    status: "",
    contactName: "",
    contactEmail: "",
    aadharNumber: "",
    contactPhone: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const clientType = [
    { key: '1', value: "Individual" },
    { key: '2', value: "Corporate" },
  ];
  const clientStatus = [
    { key: '0', value: "Inactive" },
    { key: '1', value: "Active" },
    { key: '2', value: "Deleted" },
  ];
  const createClient = () => {
    createNewClient({
      status: Number(formValues.status),
      client_type: Number(formValues.type),
      address: formValues.clientAddress,
      name: formValues.clientName,
      contact_person: {
        aadhar_card: formValues.aadharNumber,
        email: formValues.contactEmail,
        name: formValues.contactName,
        phone: formValues.contactPhone,
      },
    })
      .then(() => navigate("/clients"))
      .catch((error) => "");
  };
  const updateClientWithId = () => {
    updateClient(id, {
      status: Number(formValues.status),
      client_type: Number(formValues.type),
      address: formValues.clientAddress,
      name: formValues.clientName,
      contact_person: {
        aadhar_card: formValues.aadharNumber,
        email: formValues.contactEmail,
        name: formValues.contactName,
        phone: formValues.contactPhone,
      },
    })
      .then((response) => navigate("clients"))
      .catch((error) => "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
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
      type: event.target.value,
    });
  };


  const handleSubmit = (e, isEdit) => {
    setIsSubmit(true);
    setFormErrors(validate(formValues));
    if (isEdit) {
      updateClientWithId();
    } else {
      createClient();
    }
  };
  const patchValue = (clientData) => {
    const abc = {
      clientName: clientData.name,
      clientAddress: clientData.address,
      type: (clientData.client_type).toString(),
      status: (clientData.status).toString(),
      contactName: clientData.contact_person?.name,
      contactEmail: clientData.contact_person?.email,
      aadharNumber: clientData.contact_person?.aadhar_card,
      contactPhone: clientData.contact_person?.phone,
    };
    setFormValues(abc);
  };
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      getClientByID(id)
        .then((response) => patchValue(response.data))
        .catch((error) => "");
    }
    if (Object.keys(formErrors).length === 0 && isSubmit) {
    }
  }, []);

  const validate = (values) => {
    const errors = {};
    const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/i;
    const aadharRegex = /^\d{12}$/;
    if (!values.clientAddress) {
      errors.clientAddress = "Address is required";
    }
    if (!values.contactEmail) {
      errors.contactEmail = "Email is required";
    } else if (!emailRegex.test(values.contactEmail)) {
      errors.contactEmail = "Email is not valid";
    }
    if (!values.contactName) {
      errors.contactName = "Contact name is required";
    }
    if (!values.clientName) {
      errors.clientName = "Contact name is required";
    }
    if (!values.type) {
      errors.type = "Client type is required";
    }
    if (!values.status) {
      errors.status = "Client status is required";
    }
    if (!values.contactPhone) {
      errors.status = "Phone number is required";
    }
    if (values.aadharNumber && !aadharRegex.test(values.aadharNumber)) {
        errors.aadharNumber = "Invalid Aadhar number";
      }
    return errors;
  };

  return (
    <>
      <div className="text-gray-700 text-500 font-bold mb-6">
        {isEdit ? "Edit" : "Create New"} Client
      </div>
      <form className=" !h-fit container mx-auto shadow-z1 p-8 rounded-2xl">
        <div className="flex gap-2 mb-7 justify-between">
          <div className="flex-1">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 text-300 "
            >
              Client Name
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
              name="clientName"
              value={formValues.clientName}
              onChange={handleChange}
              required
            />
            <p className="text-red-400">{formErrors.clientName}</p>
          </div>
          <div className="flex-1">
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-medium text-gray-900 text-300 "
            >
              Address
            </label>
            <input
              type="text"
              id="clientAddress"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
              required
              name="clientAddress"
              value={formValues.clientAddress}
              onChange={handleChange}
            />
            <p className="text-red-400">{formErrors.clientAddress}</p>
          </div>
        </div>
        <div className="flex gap-2 mb-10 justify-between">
          <div className="flex-1">
            <label
              htmlFor="type"
              className="block mb-2 text-sm font-medium text-gray-900 text-300 "
            >
              Client Status
            </label>
            <div className="flex" >
                {clientStatus.map((option) => (
                    <div className="flex items-center me-4" key={option.key}>
                        <input
                        type="radio"
                        required
                        id={option.value}
                        name="status"
                        value={option.key}
                        className="w-4 h-4 text-gray-900 focus:ring-black ring-offset-gray-800 bg-white border-gray-600"
                        checked={formValues.status === option.key}
                        onChange={handleStatusChange}
                        />
                        <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor={option.value}>{option.value}</label>
                    </div>
                ))}
            </div>
            <p className="text-red-400">{formErrors.status}</p>
          </div>
          <div className="flex-1">
            <label
              htmlFor="type"
              className="block mb-2 text-sm font-medium text-gray-900 text-300 "
            >
              Client Type
            </label>
            <div className="flex" >
                {clientType.map((option) => (
                    <div className="flex items-center me-4" key={option.key}>
                        <input
                        type="radio"
                        id={option.value}
                        name="type"
                        value={option.key}
                        className="w-4 h-4 text-gray-900 focus:ring-black ring-offset-gray-800 bg-white border-gray-600"
                        checked={formValues.type === option.key}
                        onChange={handleTypeChange}
                        />
                        <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor={option.value}>{option.value}</label>
                    </div>
                ))}
            </div>
            <p className="text-red-400">{formErrors.type}</p>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl">
          Contact person
          {/* <div className="flex items-start mb-5">
            <div className="flex items-center h-5">
              <input
                id="sameAsAbove"
                type="checkbox"
                value=""
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                required
              />
            </div>
            <label
              htmlFor="sameAsAbove"
              className="ms-2 text-sm font-medium text-gray-900 text-300"
            >
              Same As above
            </label>
          </div> */}
          <div className="flex gap-2 mb-5 justify-between">
            <div className="flex-1">
              <label
                htmlFor="contactName"
                className="block mb-2 text-sm font-medium text-gray-900 text-300 "
              >
                Name
              </label>
              <input
                type="text"
                name="contactName"
                value={formValues.contactName}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                required
              />
              <p className="text-red-400">{formErrors.contactName}</p>
            </div>
            <div className="flex-1">
              <label
                htmlFor="contactEmail"
                className="block mb-2 text-sm font-medium text-gray-900 text-300 "
              >
                Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formValues.contactEmail}
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
                htmlFor="aadhar"
                className="block mb-2 text-sm font-medium text-gray-900 text-300 "
              >
                Aadhar card
              </label>
              <input
                type="text"
                name="aadharNumber"
                value={formValues.aadharNumber}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
              />
              <p className="text-red-400">{formErrors.aadharNumber}</p>
            </div>
            <div className="flex-1">
              <label
                htmlFor="contactPhone"
                className="block mb-2 text-sm font-medium text-gray-900 text-300 "
              >
                Phone
              </label>
              <input
                type="email"
                name="contactPhone"
                value={formValues.contactPhone}
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
          onClick={() => handleSubmit(Event, isEdit)}
        >
          {!isEdit ? "Add" : "Update"} Client
        </button>
      </form>
    </>
  );
};
export default ClientAdd;
