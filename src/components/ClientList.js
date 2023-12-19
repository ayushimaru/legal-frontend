import { useState, useEffect } from "react";
import { getClients } from "../services/api/useUser";
import { useNavigate, Link } from "react-router-dom";
import '../index.css'; 
import  nodata  from "../assets/nodata.svg";
import { Table, Pagination, Space } from "antd";
import useAlert from "./Alert/useAlert";

const Clients = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { showAlert, Alert } = useAlert();
  // const [clientsList, setClientsList] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const clientType = {
    1: "Individual",
    2: "Corporate"
}
const clientStatus = {
  0: "Inactive",
  1: "Active",
  2: "Deleted"
}
  const paginationConfig = {
    pageSize: 10, // Number of items per page
    current: currentPage,
    onChange: (page) => setCurrentPage(page),
  };
  // Calculate the start and end index for the current page
  const startIndex = (currentPage - 1) * paginationConfig.pageSize;
  const endIndex = startIndex + paginationConfig.pageSize;

  // Slice the data array to display only the current page's data
  const currentPageData = dataSource.slice(startIndex, endIndex);
  const columns = [
    {
      title: "Client Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "client_type",
      key: "client_type",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/clientData/${record.key}`} className="">Edit</Link>
        </Space>
      ),
    },
  ];
  const getClientsList = async () => {
    setLoading(true);
    await getClients()
      .then(response => response.data)
      .then((responseJson) => 
      {
        const results= responseJson.map(row => ({
          key: row._id,
          name: row.name,
          client_type: clientType[row.client_type],
          status: clientStatus[row.status],
          email: row.contact_person.email,
          contact: row.contact_person.phone,
        }))
        setDataSource(results);
        setLoading(false);
      })
      .catch(() => showAlert("Oops! No data found!", "error", 8000));
  };
  function createNew() {
    navigate("/clientData");
  }
  useEffect(() => {
    getClientsList();
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
              No clients found. Please create a new client
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
            <div className="text-gray-700 text-500 font-bold">Clients</div>
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
              dataSource={currentPageData}
              bordered
              className="mb-4"
              pagination={false}
            ></Table>
            <Pagination className="float-right" {...paginationConfig} total={dataSource.length} />
          </div>
          {/* <div className="relative overflow-x-auto shadow-z1 sm:rounded-lg">
            <table className="w-full text-left rtl:text-right text-gray-900">
              <thead
                className="text-300 text-gray-600"
                style={{ backgroundColor: "#cccccc" }}
              >
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Client Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientsList.map((item) => (
                  <tr
                    className="border-b border-gray-10 text-gray-900 bg-white border-gray-700 text-300 hover:bg-gray-100"
                    key={item?._id}
                  >
                    <td className="px-6 py-4">{item?.name}</td>
                    <td className="px-6 py-4">{item?.client_type}</td>
                    <td className="px-6 py-4">{item?.status}</td>
                    <td className="px-6 py-4">{item?.contact_person?.phone}</td>
                    <td className="px-6 py-4">{item?.contact_person?.email}</td>
                    <td className="px-6 py-4 text-right underline">
                      <Link to={`/clientData/${item?._id}`} className="">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Alert></Alert>
          </div> */}
        </>
      )}
    </>
  );
};
export default Clients;
