import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  updateCase,
  getClients,
  addNewCase,
  getCaseByID,
} from "../../services/api/useUser";
import { useNavigate } from "react-router-dom";

const CasesAdd = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [clientsList, setClientsList] = useState();
  const initialValues = {
    caseTitle: "",
    description: "",
    caseType: "",
    status: "",
    courtType: "",
    client: "",
    oppositionName: "",
    oppositionEmail: "",
    oppositionPhone: "",
    oppositionAddress: "",
    oppositionType: "",
    oppositionLawyerEmail: "",
    oppositionLawyerName: "",
    oppositionLawyerPhone: "",
    oppositionLawyerAddress: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const oppositionType = [
    { key: "1", value: "Individual" },
    { key: "2", value: "Corporate" },
  ];
  const caseStatus = [
    { key: "0", value: "Inactive" },
    { key: "1", value: "Active" },
    { key: "2", value: "Deleted" },
  ];
  const courtType = [
    { key: 1, value: "Supreme Court of India" },
    { key: 2, value: "High Court" },
    { key: 3, value: "District Court" },
    { key: 4, value: "Specialized Court" },
    { key: 5, value: "Tribunals" },
  ];
  const caseType = [
    { key: 1, value: "Civil Case" },
    { key: 2, value: "Criminal Case" },
    { key: 3, value: "Constitutional Case" },
    { key: 4, value: "Matrimonial Case" },
    { key: 5, value: "Labour and Employment Case" },
    { key: 6, value: "Consumer Dispute" },
    { key: 7, value: "Intellectual Property Case" },
    { key: 8, value: "Tax Cases" },
  ];

  const createCase = () => {
    addNewCase({
      Description: formValues.description,
      case_type: Number(formValues.caseType),
      client_id: formValues.client,
      court_type: Number(formValues.courtType),
      status: Number(formValues.status),
      title: formValues.caseTitle,
      opposition: {
        address: formValues.oppositionAddress,
        email: formValues.oppositionEmail,
        name: formValues.oppositionName,
        phone: formValues.oppositionPhone,
        type: Number(formValues.oppositionType),
      },
      opposition_lawyer: {
        address: formValues.oppositionLawyerAddress,
        email: formValues.oppositionLawyerEmail,
        name: formValues.oppositionLawyerName,
        phone: formValues.oppositionLawyerPhone,
      },
    })
      .then(() => navigate("/cases"))
      .catch((error) => "");
  };

  const updateClientWithId = () => {
    updateCase(id, {
      Description: formValues.description,
      case_type: Number(formValues.caseType),
      client_id: formValues.client,
      court_type: Number(formValues.courtType),
      status: Number(formValues.status),
      title: formValues.caseTitle,
      opposition: {
        address: formValues.oppositionAddress,
        email: formValues.oppositionEmail,
        name: formValues.oppositionName,
        phone: formValues.oppositionPhone,
        type: Number(formValues.oppositionType),
      },
      opposition_lawyer: {
        address: formValues.oppositionLawyerAddress,
        email: formValues.oppositionLawyerEmail,
        name: formValues.oppositionLawyerName,
        phone: formValues.oppositionLawyerPhone,
      },
    })
      .then((response) => navigate("/cases"))
      .catch((error) => "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    setIsSubmit(true);
    setFormErrors(validate(formValues));
    if (isEdit) {
      updateClientWithId();
    } else {
      createCase();
    }
  };
  const patchValue = (caseData) => {
    const formData = {
      caseTitle: caseData.title,
      description: caseData.Description,
      caseType: caseData.case_type,
      client: caseData.client_id,
      courtType: caseData.court_type,
      status: caseData.status.toString(),
      oppositionName: caseData.opposition?.name,
      oppositionEmail: caseData.opposition?.email,
      oppositionPhone: caseData.opposition?.phone,
      oppositionAddress: caseData.opposition?.address,
      oppositionType: (caseData.opposition?.type).toString(),
      oppositionLawyerEmail: caseData.opposition_lawyer.email,
      oppositionLawyerName: caseData.opposition_lawyer.name,
      oppositionLawyerPhone: caseData.opposition_lawyer.phone,
      oppositionLawyerAddress: caseData.opposition_lawyer.address,
    };
    setFormValues(formData);
  };
  const getClientsList = async () => {
    await getClients()
      .then((response) => setClientsList(response.data))
      .catch(() => "");
  };
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      getCaseByID(id)
        .then((response) => patchValue(response.data))
        .catch((error) => "");
    }
    if (Object.keys(formErrors).length === 0 && isSubmit) {
    }
    getClientsList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = (values) => {
    const errors = {};
    const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/i;
    const phoneRegex = /^[6-9]\d{9}$/;
    console.log("Hiiiii");
    if (!values.caseTitle) {
      errors.caseTitle = "Case title is required";
    }
    if (!values.description) {
      errors.description = "Description is required";
    }
    if (!values.status) {
      errors.status = "Status is required";
    }
    if (!values.courtType) {
      errors.courtType = "Court type is required";
    }
    if (!values.caseType) {
      errors.caseType = "Case Type is required";
    }
    if (!values.client) {
      errors.client = "Client is required";
    }
    if (
      values.oppositionLawyerEmail &&
      !emailRegex.test(values.oppositionLawyerEmail)
    ) {
      errors.oppositionLawyerEmail = "Invalid Email";
    }
    if (values.oppositionEmail && !emailRegex.test(values.oppositionEmail)) {
      errors.oppositionEmail = "Invalid Email";
    }
    if (values.oppositionPhone && !phoneRegex.test(values.oppositionPhone)) {
      errors.oppositionPhone = "Invalid contact number";
    }
    if (
      values.oppositionLawyerPhone &&
      !phoneRegex.test(values.oppositionLawyerPhone)
    ) {
      errors.oppositionLawyerPhone = "Invalid contact number";
    }
    console.log(errors, "errorrrrrrr");
    return errors;
  };

  return (
    <>
      <div className="text-gray-700 text-500 font-bold mb-6">
        {isEdit ? "Edit" : "Create New"} Case
      </div>
      <form className=" !h-fit container mx-auto shadow-z1 p-8 rounded-2xl" onSubmit={handleSubmit}>
        <div className="flex gap-2 mb-7 justify-between">
          <div className="flex-1">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 text-300 "
            >
              Title
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
              name="caseTitle"
              value={formValues.caseTitle}
              onChange={handleChange}
              required
            />
            <p className="text-red-400">{formErrors.caseTitle}</p>
          </div>
          <div className="flex-1">
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-medium text-gray-900 text-300 "
            >
              Description
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
              required
              name="description"
              value={formValues.description}
              onChange={handleChange}
            />
            <p className="text-red-400">{formErrors.description}</p>
          </div>
        </div>
        <div className="flex gap-2 mb-10 justify-between">
          <div className="flex-1">
            <label
              htmlFor="status"
              className="block mb-2 text-sm font-medium text-gray-900 text-300 "
            >
              Case Status
            </label>
            <div className="flex">
              {caseStatus.map((option) => (
                <div
                  className="flex items-center me-4"
                  key={option.value + `status`}
                >
                  <input
                    type="radio"
                    required
                    id={option.value}
                    name="status"
                    value={option.key}
                    className="w-4 h-4 text-gray-900 focus:ring-black ring-offset-gray-800 bg-white border-gray-600"
                    checked={formValues.status === option.key}
                    onChange={handleChange}
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
              htmlFor="caseType"
              className="block mb-2 text-sm font-medium text-gray-900 text-300 "
            >
              Case Type
            </label>
            <div className="flex">
              <select
                name="caseType"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg  block w-full p-2.5 focus:ring-black focus:border-black"
                value={formValues.caseType}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Case
                </option>
                {caseType.map((option) => (
                  <option key={option.value} value={option.key}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-red-400">{formErrors.caseType}</p>
          </div>
        </div>
        <div className="flex gap-2 mb-10 justify-between">
          <div className="flex-1">
            <label
              htmlFor="clientCase"
              className="block mb-2 text-sm font-medium text-gray-900 text-300 "
            >
              Client
            </label>
            <div className="flex">
              <select
                name="client"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg  block w-full p-2.5 focus:ring-black focus:border-black"
                value={formValues.client}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Client
                </option>
                {clientsList?.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-red-400">{formErrors.client}</p>
          </div>
          <div className="flex-1">
            <label
              htmlFor="clientCourt"
              className="block mb-2 text-sm font-medium text-gray-900 text-300 "
            >
              Court Type
            </label>
            <div className="flex">
              <select
                name="courtType"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg  block w-full p-2.5 focus:ring-black focus:border-black"
                value={formValues.courtType}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Client
                </option>
                {courtType.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-red-400">{formErrors.courtType}</p>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl mb-4">
          <p className="mb-4 font-bold text-300">Opposition</p>
          <div className="flex gap-2 mb-5 justify-between">
            <div className="flex-1">
              <label
                htmlFor="oppositionName"
                className="block mb-2 text-sm font-medium text-gray-900 text-300 "
              >
                Name
              </label>
              <input
                type="text"
                name="oppositionName"
                value={formValues.oppositionName}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="oppositionEmail"
                className="block mb-2 text-sm font-medium text-gray-900 text-300 "
              >
                Email
              </label>
              <input
                type="email"
                name="oppositionEmail"
                value={formValues.oppositionEmail}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
              />
              <p className="text-red-400">{formErrors.oppositionEmail}</p>
            </div>
          </div>
          <div className="flex gap-2 mb-5 justify-between">
            <div className="flex-1">
              <label
                htmlFor="oppositionAddress"
                className="block mb-2 text-sm font-medium text-gray-900 text-300 "
              >
                Address
              </label>
              <input
                type="text"
                name="oppositionAddress"
                value={formValues.oppositionAddress}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="oppositionPhone"
                className="block mb-2 text-sm font-medium text-gray-900 text-300 "
              >
                Phone
              </label>
              <input
                type="text"
                name="oppositionPhone"
                value={formValues.oppositionPhone}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
              />
              <p className="text-red-400">{formErrors.oppositionPhone}</p>
            </div>
            <div className="flex-1">
              <label
                htmlFor="oppositionType"
                className="block mb-2 text-sm font-medium text-gray-900 text-300 "
              >
                Type
              </label>
              <div className="flex">
                {oppositionType.map((option) => (
                  <div
                    className="flex items-center me-4"
                    key={option.value + `oppositionType`}
                  >
                    <input
                      type="radio"
                      id={option.key}
                      name="oppositionType"
                      value={option.key}
                      className="w-4 h-4 text-gray-900 focus:ring-black ring-offset-gray-800 bg-white border-gray-600"
                      checked={formValues.oppositionType === option.key}
                      onChange={handleChange}
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
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl mb-4">
          <p className="mb-4 font-bold text-300">Opposition Lawyer</p>
          <div className="flex gap-2 mb-5 justify-between">
            <div className="flex-1">
              <label
                htmlFor="oppositionLawyerName"
                className="block mb-2 text-sm font-medium text-gray-900 text-300 "
              >
                Name
              </label>
              <input
                type="text"
                name="oppositionLawyerName"
                value={formValues.oppositionLawyerName}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="oppositionLawyerEmail"
                className="block mb-2 text-sm font-medium text-gray-900 text-300 "
              >
                Email
              </label>
              <input
                type="email"
                name="oppositionLawyerEmail"
                value={formValues.oppositionLawyerEmail}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
              />
              <p className="text-red-400">{formErrors.oppositionLawyerEmail}</p>
            </div>
          </div>
          <div className="flex gap-2 mb-5 justify-between">
            <div className="flex-1">
              <label
                htmlFor="oppositionLawyerAddress"
                className="block mb-2 text-sm font-medium text-gray-900 text-300 "
              >
                Address
              </label>
              <input
                type="text"
                name="oppositionLawyerAddress"
                value={formValues.oppositionLawyerAddress}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="oppositionLawyerPhone"
                className="block mb-2 text-sm font-medium text-gray-900 text-300 "
              >
                Phone
              </label>
              <input
                type="text"
                name="oppositionLawyerPhone"
                value={formValues.oppositionLawyerPhone}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
              />
              <p className="text-red-400">{formErrors.oppositionLawyerPhone}</p>
            </div>
          </div>
        </div>
        <button type="submit"
          className="text-white bg-black hover:bg-gray-800 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {!isEdit ? "Add" : "Update"} Case
        </button>
      </form>
    </>
  );
};
export default CasesAdd;
