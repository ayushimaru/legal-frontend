import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DeleteFilled, EditFilled, EyeFilled } from '@ant-design/icons';
import {
  updateCase,
  getClients,
  addNewCase,
  getCaseByID,
  getAllDocuments,
  getAllNotes,
  getAccessDocument,
  createNewNote,
  updateNote,
  deleteNote,
  deleteDocument
} from "../../services/api/useUser";
import { Table, Space, Modal, List, Skeleton } from "antd";
import useAlert from "../Alert/useAlert";
import { useNavigate } from "react-router-dom";

const CasesAdd = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [clientsList, setClientsList] = useState();
  const [docList, setDocsList] = useState();
  const [noteList, setNoteList] = useState();
  const [loading, setLoading] = useState(false);
  const [caseDetail, setCaseDetail] = useState();
  const { showAlert, Alert } = useAlert();
  const [note, setNote] = useState("");
  const [noteId, setNoteId] = useState("");
  const [open, setOpen] = useState(false);
  const [isNoteEdit, setIsNoteEdit] = useState(false);
  const [isNoteAdd, setIsNoteAdd] = useState(false);
  const [isNoteView, setIsNoteView] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const initialValues = {
    title: "",
    Description: "",
    case_type: "",
    status: "",
    court_type: "",
    client_id: "",
    opposition: {
        address: "",
        email: "",
        name: "",
        phone: "",
        type: "",
    },
    opposition_lawyer: {
        address: "",
        email: "",
        name: "",
        phone: "",
    },
  };
  const showModal = (type, note) => {
    switch (type) {
      case "add":
        setIsNoteAdd(true);
        setNote('');
        break;
      case "view":
        setIsNoteView(true);
        break;
      case "edit":
        setIsNoteEdit(true);
        setNoteId(note._id);
        break;
      default:
        break;
    }
    if (type !== "add") {
      setNote(note.note);
    }
    setOpen(true);
  };
  const handleCancel = () => {
    setIsNoteAdd(false);
    setIsNoteView(false);
    setIsNoteEdit(false);
    setOpen(false);
  };
  const handleOk = () => {
    if (isNoteEdit) {
      setConfirmLoading(true);
      updateNote(noteId, {
        note: note,
        case_id: id,
      })
        .then(() =>
          setTimeout(() => {
            getNotesList();
            setIsNoteAdd(false);
            setIsNoteView(false);
            setIsNoteEdit(false);
            setNoteId(null);
            setNote('');
            setOpen(false);
            setConfirmLoading(false);
          }, 2000)
        )
        .catch(() =>
          showAlert("Oops! Create case failed!", "error", 8000)
        );
    }
    if (isNoteAdd) {
        setConfirmLoading(true);
        createNewNote({
          note: note,
          case_id: id,
        })
          .then(() =>
            setTimeout(() => {
              getNotesList();
              setIsNoteAdd(false);
              setIsNoteView(false);
              setIsNoteEdit(false);
              setNoteId(null);
              setNote('');
              setOpen(false);
              setConfirmLoading(false);
            }, 2000)
          )
          .catch((error) =>
            showAlert("Oops! Create case failed!", "error", 8000)
          );
      }
  };
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Space size="middle" className="mr-4">
            <button onClick={() => accessDocument(record.key)} className="">
              <EyeFilled />
            </button>
          </Space>
          <Space size="middle" className="mr-4">
            <button onClick={() => editDocument(record.key)} className="">
              <EditFilled />
            </button>
          </Space>
          <Space size="middle">
            <button onClick={() => deleteDocumentByID(record.key)} className="">
              <DeleteFilled />
            </button>
          </Space>
        </>
      ),
    },
  ];
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const oppositionType = [
    { key: 1, value: "Individual" },
    { key: 2, value: "Corporate" },
  ];
  const caseStatus = [
    { key: 0, value: "Inactive" },
    { key: 1, value: "Active" },
  ];
  const courtType = [
    { key: 1, value: "Supreme Court of India" },
    { key: 2, value: "High Court" },
    { key: 3, value: "District Court" },
    { key: 4, value: "Specialized Court" },
    { key: 5, value: "Tribunals" },
  ];
  const case_type = [
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
      Description: formValues.Description,
      case_type: Number(formValues.case_type),
      client_id: formValues.client_id,
      court_type: Number(formValues.court_type),
      status: Number(formValues.status),
      title: formValues.title,
      opposition: {
        address: formValues.opposition.address,
        email: formValues.opposition.email,
        name: formValues.opposition.name,
        phone: formValues.opposition.phone,
        type: Number(formValues.opposition.type),
      },
      opposition_lawyer: {
        address: formValues.opposition_lawyer.address,
        email: formValues.opposition_lawyer.address,
        name: formValues.opposition_lawyer.name,
        phone: formValues.opposition_lawyer.phone,
      },
    })
      .then(() => navigate("/cases"))
      .catch((error) => showAlert("Oops! Create case failed!", "error", 8000));
  };
  async function accessDocument(id) {
    setLoading(true);
    await getAccessDocument(id)
      .then((response) => {
        window.open(response.url, "_blank");
        setLoading(false);
      })
      .catch(() => showAlert("Oops! Unable to view document!", "error", 8000));
  }
  async function deleteNoteByID(id) {
    setLoading(true);
    await deleteNote(id)
      .then(() => {
        getNotesList();
        setLoading(false);
      })
      .catch(() => showAlert("Oops! Unable to delete note!", "error", 8000));
  }
  async function deleteDocumentByID(id) {
    setLoading(true);
    await deleteDocument(id)
      .then(() => {
        getDocumentsList();
        setLoading(false);
      })
      .catch(() => showAlert("Oops! Unable to delete document!", "error", 8000));
  }
  const editDocument = (key) => {
    navigate(`/documentData/${key}`, { state: { id } });
  }

  const updateClientWithId = () => {
    const editedChanges = findChanges(caseDetail, formValues);
    updateCase(id, editedChanges)
      .then(() => navigate("/cases"))
      .catch(() => showAlert("Oops! Update failed!", "error", 8000));
  };
  const findChanges = (original, updated) => {
    const changes = {};
    updated.case_type = Number(updated.case_type);
    updated.court_type = Number(updated.court_type);
    updated.status = Number(updated.status);
    updated.opposition.type = Number(updated.opposition.type);
    for (const key in updated) {
      const editedValue = updated[key];
      const originalValue = original[key];
      if (JSON.stringify(editedValue) !== JSON.stringify(originalValue)) {
        changes[key] = editedValue;
      }
    }
    return changes;
  };
  const getDocumentsList = async () => {
    await getAllDocuments({ caseId: id })
      .then((response) => {
        const results = response.data.map((row) => ({
          key: row._id,
          title: row.title,
          note: row.note,
        }));
        setDocsList(results);
      })
      .catch(() => showAlert("Oops! No documents found!", "error", 8000));
  };
  const getNotesList = async () => {
    await getAllNotes({ caseId: id })
      .then((response) => {
        setNoteList(response.data);
      })
      .catch(() => showAlert("Oops! No notes found!", "error", 8000));
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
  const addDocument = () => {
    navigate("/documentData", { state: { id } });
  };
  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if(Object.keys(validate(formValues)).length) {
      setFormErrors(validate(formValues));
      return;
    }
    if (isEdit) {
      updateClientWithId();
    } else {
      createCase();
    }
  };
  const patchValue = (caseData) => {
    setCaseDetail(caseData);
    const formData = {
      title: caseData.title,
      Description: caseData.Description,
      case_type: caseData.case_type,
      client_id: caseData.client_id,
      court_type: caseData.court_type,
      status: caseData.status.toString(),
      opposition: {
        address: caseData.opposition?.address,
        email: caseData.opposition?.email,
        name: caseData.opposition?.name,
        phone: caseData.opposition?.phone,
        type: (caseData.opposition?.type).toString(),
      },
      opposition_lawyer: {
        address: caseData.opposition_lawyer?.address,
        email: caseData.opposition_lawyer?.email,
        name: caseData.opposition_lawyer?.name,
        phone: caseData.opposition_lawyer?.phone,
      },
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
      getDocumentsList();
      getNotesList();
    }
    getClientsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = (values) => {
    const errors = {};
    const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/i;
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!values.title) {
      errors.title = "Case title is required";
    }
    if (!values.Description) {
      errors.Description = "Description is required";
    }
    if (!values.status) {
      errors.status = "Status is required";
    }
    if (!values.court_type) {
      errors.court_type = "Court type is required";
    }
    if (!values.case_type) {
      errors.case_type = "Case Type is required";
    }
    if (!values.client_id) {
      errors.client_id = "Client is required";
    }
    if (
      values.opposition_lawyer.email &&
      !emailRegex.test(values.opposition_lawyer.email)
    ) {
      errors.oppositionLawyerEmail = "Invalid Email";
    }
    if (values.opposition.email && !emailRegex.test(values.opposition.email)) {
      errors.oppositionEmail = "Invalid Email";
    }
    if (values.opposition.phone && !phoneRegex.test(values.opposition.phone)) {
      errors.oppositionPhone = "Invalid contact number";
    }
    if (
      values.opposition_lawyer.phone &&
      !phoneRegex.test(values.opposition_lawyer.phone)
    ) {
      errors.oppositionLawyerPhone = "Invalid contact number";
    }
    return errors;
  };

  return (
    <>
      <div className="text-gray-700 text-500 font-bold mb-6">
        {isEdit ? "Edit" : "Create New"} Case
      </div>
      <div>
        <form
          className=" !h-fit container mx-auto shadow-z1 p-8 rounded-2xl mb-6"
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
                htmlFor="Description"
                className="block mb-2 text-sm font-medium text-gray-900 text-300 "
              >
                Description
              </label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                required
                name="Description"
                value={formValues.Description}
                onChange={handleChange}
              />
              <p className="text-red-400">{formErrors.Description}</p>
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
                      checked={Number(formValues.status) === option.key}
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
                htmlFor="case_type"
                className="block mb-2 text-sm font-medium text-gray-900 text-300 "
              >
                Case Type
              </label>
              <div className="flex">
                <select
                  name="case_type"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg  block w-full p-2.5 focus:ring-black focus:border-black"
                  value={formValues.case_type}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Case
                  </option>
                  {case_type.map((option) => (
                    <option key={option.value} value={option.key}>
                      {option.value}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-red-400">{formErrors.case_type}</p>
            </div>
          </div>
          <div className="flex gap-2 mb-10 justify-between">
            <div className="flex-1">
              <label
                htmlFor="client_id"
                className="block mb-2 text-sm font-medium text-gray-900 text-300 "
              >
                Client
              </label>
              <div className="flex">
                <select
                  name="client_id"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg  block w-full p-2.5 focus:ring-black focus:border-black"
                  value={formValues.client_id}
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
              <p className="text-red-400">{formErrors.client_id}</p>
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
                  name="court_type"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg  block w-full p-2.5 focus:ring-black focus:border-black"
                  value={formValues.court_type}
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
              <p className="text-red-400">{formErrors.court_type}</p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-xl mb-4">
            <p className="mb-4 font-bold text-300">Opposition</p>
            <div className="flex gap-2 mb-5 justify-between">
              <div className="flex-1">
                <label
                  htmlFor="opposition[name]"
                  className="block mb-2 text-sm font-medium text-gray-900 text-300 "
                >
                  Name
                </label>
                <input
                  type="text"
                  name="opposition[name]"
                  value={formValues.opposition.name}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="opposition[email]"
                  className="block mb-2 text-sm font-medium text-gray-900 text-300 "
                >
                  Email
                </label>
                <input
                  type="email"
                  name="opposition[email]"
                  value={formValues.opposition.email}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                />
                <p className="text-red-400">{formErrors.oppositionEmail}</p>
              </div>
            </div>
            <div className="flex gap-2 mb-5 justify-between">
              <div className="flex-1">
                <label
                  htmlFor="opposition[address]"
                  className="block mb-2 text-sm font-medium text-gray-900 text-300 "
                >
                  Address
                </label>
                <input
                  type="text"
                  name="opposition[address]"
                  value={formValues.opposition.address}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="opposition[phone]"
                  className="block mb-2 text-sm font-medium text-gray-900 text-300 "
                >
                  Phone
                </label>
                <input
                  type="text"
                  name="opposition[phone]"
                  maxLength={10}
                  value={formValues.opposition.phone}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                />
                <p className="text-red-400">{formErrors.oppositionPhone}</p>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="opposition[type]"
                  className="block mb-2 text-sm font-medium text-gray-900 text-300 "
                >
                  Type
                </label>
                <div className="flex">
                  {oppositionType.map((option) => (
                    <div
                      className="flex items-center me-4"
                      key={option.key}
                    >
                      <input
                        type="radio"
                        id={option.key}
                        name="opposition[type]"
                        value={option.key}
                        className="w-4 h-4 text-gray-900 focus:ring-black ring-offset-gray-800 bg-white border-gray-600"
                        checked={Number(formValues.opposition.type) === option.key}
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
                  htmlFor="opposition_lawyer[name]"
                  className="block mb-2 text-sm font-medium text-gray-900 text-300 "
                >
                  Name
                </label>
                <input
                  type="text"
                  name="opposition_lawyer[name]"
                  value={formValues.opposition_lawyer.name}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="opposition_lawyer[email]"
                  className="block mb-2 text-sm font-medium text-gray-900 text-300 "
                >
                  Email
                </label>
                <input
                  type="email"
                  name="opposition_lawyer[email]"
                  value={formValues.opposition_lawyer.email}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                />
                <p className="text-red-400">
                  {formErrors.oppositionLawyerEmail}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mb-5 justify-between">
              <div className="flex-1">
                <label
                  htmlFor="opposition_lawyer[address]"
                  className="block mb-2 text-sm font-medium text-gray-900 text-300 "
                >
                  Address
                </label>
                <input
                  type="text"
                  name="opposition_lawyer[address]"
                  value={formValues.opposition_lawyer.address}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="opposition_lawyer[phone]"
                  className="block mb-2 text-sm font-medium text-gray-900 text-300 "
                >
                  Phone
                </label>
                <input
                  type="text"
                  name="opposition_lawyer[phone]"
                  maxLength={10}
                  value={formValues.opposition_lawyer.phone}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-300 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                />
                <p className="text-red-400">
                  {formErrors.oppositionLawyerPhone}
                </p>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="text-white bg-black hover:bg-gray-800 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {!isEdit ? "Add" : "Update"} Case
          </button>
        </form>
        {isEdit && (
          <div>
            <div className="!h-fit container mx-auto shadow-z1 p-8 rounded-2xl mb-6">
              <div className="flex justify-between mb-6 items-end">
                <div className="text-gray-700 text-500 font-bold">
                  Documents
                </div>
                <button
                  type="button"
                  onClick={addDocument}
                  className="text-white bg-black hover:bg-gray-800 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  Add Document
                </button>
              </div>

              <Table
                loading={loading}
                columns={columns}
                dataSource={docList}
                bordered
                pagination={false}
                className="mb-4"
              ></Table>
            </div>
            <div className="!h-fit container mx-auto shadow-z1 p-8 rounded-2xl">
              <div className="flex justify-between mb-6 items-end">
                <div className="text-gray-700 text-500 font-bold">Notes</div>
                <button
                  type="button"
                  onClick={() => showModal("add")}
                  className="text-white bg-black hover:bg-gray-800 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  Add Note
                </button>
              </div>
              <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                loading={loading}
                dataSource={noteList}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                        <button onClick={() => showModal("view", item)}>
                            <EyeFilled />
                         </button>,
                        <button onClick={() => showModal("edit", item)} className="">
                            <EditFilled />
                        </button>,
                        <button onClick={() => deleteNoteByID(item._id)} className="">
                            <DeleteFilled />
                        </button>,
                    ]}
                  >
                    <Skeleton
                      avatar
                      title={false}
                      loading={item.loading}
                      active
                    >
                        <p className="block mb-2 text-sm font-medium text-gray-900 text-300 overflow-hidden text-nowrap text-ellipsis">{item.note}</p>
                    </Skeleton>
                  </List.Item>
                )}
              />
            </div>
          </div>
        )}
        <Alert></Alert>
      </div>
      <Modal
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        {isNoteAdd && (
          <p className="text-gray-700 text-500 font-bold mb-6">Add Note</p>
        )}
        {isNoteEdit && (
          <p className="text-gray-700 text-500 font-bold mb-6">Edit Note</p>
        )}
        {isNoteView && (
          <p className="text-gray-700 text-500 font-bold mb-6">View Note</p>
        )}
        <textarea
          id="note"
          rows="4"
          disabled={isNoteView}
          value={note}
          onChange={handleNoteChange}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your notes here..."
        ></textarea>
      </Modal>
    </>
  );
};
export default CasesAdd;
