import { useState, useEffect } from "react";
import { getAllDocuments, getAccessDocument, deleteDocument } from "../../services/api/useUser";
import { useNavigate } from "react-router-dom";
import '../../index.css'; 
import  nodata  from "../../assets/nodata.svg";
import { Table, Space } from "antd";
import useAlert from "../Alert/useAlert";
import { DeleteFilled, EditFilled, EyeFilled } from '@ant-design/icons';

const Documents = () => {
  const navigate = useNavigate();
  const { showAlert, Alert } = useAlert();
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(false);
  
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
      title: "Case",
      dataIndex: "caseTitle",
      key: "caseTitle",
    },
    {
      title: 'Action',
      key: 'action',
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
            </Space></>
      ),
    },
  ];
  const getDocumentsList = async (page, pageSize) => {
    setLoading(true);
    await getAllDocuments({perPage: pageSize, pageNumber:page})
      .then(response => 
      {
        const results= (response.data).map(row => ({
          key: row._id,
          title: row.title,
          caseTitle: row.case_title,
          note: row.note,
        }))
        setDataSource(results);
        setTotal(response.total);
        setLoading(false);
      })
      .catch(() => showAlert("Oops! No data found!", "error", 8000));
  };
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
    navigate(`/documentData/${key}`);
  }
  async function accessDocument(id) {
    setLoading(true);
    await getAccessDocument(id)
      .then(response => 
      {
        window.open(response.url, '_blank');
        setLoading(false);
      })
      .catch(() => showAlert("Oops! No data found!", "error", 8000));
  }

  function createNew() {
    navigate("/documentData");
  }
  useEffect(() => {
    getDocumentsList(1, 10);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!dataSource?.length && (
        <>
          <div className="justify-center pb-[200px] align-center relative flex flex-col justify-center overflow-hidden px-32 py-10 bg-white">
            <img alt="noData" className="w-96 h-auto m-auto" src={nodata}></img>
            <p className="text-center mb-8">
              {" "}
              No documents found. Please create a new document
            </p>
            <button
              type="submit"
              className="m-auto text-white bg-black hover:bg-gray-800 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-cente"
              onClick={createNew}
            >
              Create new
            </button>
          </div>
          <Alert></Alert>
        </>
      )}
      {dataSource?.length && (
        <>
          <div className="flex mb-6">
            <div className="text-gray-700 text-500 font-bold">Documents</div>
            <button
              type="submit"
              className="m-auto mr-0 text-white bg-black hover:bg-gray-800 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              onClick={createNew}
            >
              Create new
            </button>
          </div>
          <div>
            <Table
              loading={loading}
              columns={columns}
              dataSource={dataSource}
              bordered
              className="mb-4"
              pagination={{
                total: total,
                onChange: (page, pageSize) => {
                  getDocumentsList(page, pageSize);
                },
              }}
            ></Table>
          </div>
        </>
      )}
    </>
  );
};
export default Documents;
