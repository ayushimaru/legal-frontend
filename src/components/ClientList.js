import { useState, useEffect } from "react";
import { getClients, updateClient } from "../services/api/useUser";
import { useNavigate } from "react-router-dom";
import "../index.css";
import nodata from "../assets/nodata.svg";
import { Table, Space, Popconfirm } from "antd";
import {
  DeleteFilled,
  EditFilled,
  QuestionCircleOutlined,
  FilterFilled
} from "@ant-design/icons";
import useAlert from "./Alert/useAlert";

const Clients = () => {
  const navigate = useNavigate();
  const { showAlert, Alert } = useAlert();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const clientType = {
    1: "Individual",
    2: "Corporate",
  };
  const clientStatus = {
    0: "Inactive",
    1: "Active",
  };
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
      filters: [
        { text: 'Active', value: 1 },
        { text: 'Inactive', value: 0 },
      ],
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: filtered ? '#000000' : undefined }} />
      ),
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Space size="middle" className="mr-4">
            <button onClick={() => editClient(record)} className="">
              <EditFilled />
            </button>
          </Space>
          <Space size="middle">
            <Popconfirm
              onConfirm={() => deleteClient(record)}
              okText="Delete"
              title="Are you sure to delete this client?"
              cancelButtonProps={{ className: "custom-button-hover-sec" }}
              okButtonProps={{
                className:
                  "bg-gray-900 hover: bg-black !important custom-button-hover",
              }}
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: "red",
                  }}
                />
              }
            >
              <button>
                <DeleteFilled />
              </button>
            </Popconfirm>
          </Space>
        </>
      ),
    },
  ];
  const getClientsList = async (page, pageSize, status) => {
    setLoading(true);
    let statusFilter;
    if(status?.length > 1) {
      statusFilter = -1;
    }
    if(status?.length === 1) {
      statusFilter = status[0];
    }
    await getClients({ perPage: pageSize, pageNumber: page, statusFilter })
      .then((response) => {
        const results = response.data.map((row) => ({
          key: row._id,
          name: row.name,
          client_type: clientType[row.client_type],
          status: clientStatus[row.status],
          email: row.contact_person.email,
          contact: row.contact_person.phone,
        }));
        setDataSource(results);
        setPagination((prevPagination) => ({
          ...prevPagination,
          total: response.total,
        }));
        setLoading(false);
      })
      .catch(() => showAlert("Oops! No data found!", "error", 8000));
  };

  const deleteClient = async (client) => {
    updateClient(client.key, {
      status: 2,
    })
      .then(() => getClientsList(), setLoading(false))
      .catch(() => showAlert("Oops! unable to delete client!", "error", 8000));
  };
  function createNew() {
    navigate("/clientData");
  }
  const editClient = async (client) => {
    navigate(`/clientData/${client.key}`);
  };
  const onChange = (pagination, filters) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      ...pagination,
    }));
    getClientsList(pagination.current, pagination.pageSize, filters.status);
  };
  useEffect(() => {
    getClientsList(pagination.current, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return dataSource?.length ? (
    <div>
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
          dataSource={dataSource}
          bordered
          className="mb-4"
          onChange={onChange}
          pagination={pagination}
        ></Table>
      </div>
      <Alert></Alert>
    </div>
  ) : (
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
  );
};
export default Clients;
