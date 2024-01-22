import { useState, useEffect } from "react";
import { getAllCases, updateCase } from "../../services/api/useUser";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import nodata from "../../assets/nodata.svg";
import { Table, Space, Popconfirm } from "antd";
import {
  DeleteFilled,
  EditFilled,
  QuestionCircleOutlined,
  FilterFilled,
} from "@ant-design/icons";
import useAlert from "../Alert/useAlert";

const Cases = () => {
  const navigate = useNavigate();
  const { showAlert, Alert } = useAlert();
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const courtType = {
    1: "Supreme Court of India",
    2: "High Courts",
    3: "District Courts",
    4: "Specialized Courts",
    5: "Tribunals",
  };

  const caseType = {
    1: "Civil Cases",
    2: "Criminal Cases",
    3: "Constitutional Cases",
    4: "Matrimonial Cases",
    5: "Labour and Employment Cases",
    6: "Consumer Disputes",
    7: "Intellectual Property Cases",
    8: "Tax Cases",
  };

  const oppositiontype = {
    1: "Individual",
    2: "Corporate",
  };

  const caseStatus = {
    0: "Inactive",
    1: "Active",
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      fixed: "left",
      width: 150,
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
      width: 150,
    },
    {
      title: "Case Type",
      dataIndex: "case_type",
      key: "case_type",
      width: 150,
    },
    {
      title: "Opposition",
      dataIndex: "oppositionName",
      key: "oppositionName",
      width: 150,
    },
    {
      title: "Opposition Contact",
      dataIndex: "oppositionContact",
      key: "oppositionContact",
      width: 150,
    },
    {
      title: "Opposition Email",
      dataIndex: "oppositionEmail",
      key: "oppositionEmail",
      width: 150,
    },
    {
      title: "Opposition Lawyer",
      dataIndex: "oppositionLawyer",
      key: "oppositionLawyer",
      width: 150,
    },
    {
      title: "Lawyer Contact",
      dataIndex: "oppositionLawyerContact",
      key: "oppositionLawyerContact",
      width: 150,
    },
    {
      title: "Lawyer Email",
      dataIndex: "oppositionLawyerEmail",
      key: "oppositionLawyerEmail",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      filters: [
        { text: "Active", value: 1 },
        { text: "Inactive", value: 0 },
      ],
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: filtered ? "#000000" : undefined }} />
      ),
    },
    {
      title: "oppositionType",
      dataIndex: "oppType",
      key: "oppType",
      width: 150,
    },
    {
      title: "court",
      dataIndex: "courtType",
      key: "courtType",
      width: 150,
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <>
          <Space size="middle" className="mr-4">
            <button onClick={() => editCase(record.key)} className="">
              <EditFilled />
            </button>
          </Space>
          <Space size="middle">
            <Popconfirm
              onConfirm={() => deleteCase(record.key)}
              okText="Delete"
              title="Are you sure to delete this case?"
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
  const getCasesList = async (page, pageSize, status) => {
    setLoading(true);
    let statusFilter;
    if (status?.length > 1) {
      statusFilter = -1;
    }
    if (status?.length === 1) {
      statusFilter = status[0];
    }
    await getAllCases({ perPage: pageSize, pageNumber: page, statusFilter })
      .then((response) => {
        const results = response.data.map((row) => ({
          key: row._id,
          title: row.title,
          Description: row.Description,
          case_type: caseType[row?.case_type],
          oppositionName: row.opposition?.name,
          oppositionContact: row.opposition?.phone,
          oppositionEmail: row.opposition?.email,
          oppositionLawyerEmail: row.opposition_lawyer?.email,
          oppositionLawyer: row.opposition_lawyer?.name,
          oppositionLawyerContact: row.opposition_lawyer?.phone,
          status: caseStatus[row?.status],
          oppType: oppositiontype[row.opposition?.type],
          courtType: courtType[row?.court_type],
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
  function createNew() {
    navigate("/caseData");
  }
  function editCase(id) {
    navigate(`/caseData/${id}`);
  }
  async function deleteCase(id) {
    setLoading(true);
    await updateCase(id, {
      status: 2,
    })
      .then(() => getCasesList(), setLoading(false))
      .catch(() => showAlert("Oops! unable to delete case!", "error", 8000));
  }
  const onChangeCase = (pagination, filters) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      ...pagination,
    }));
    getCasesList(pagination.current, pagination.pageSize, filters.status);
  };
  useEffect(() => {
    getCasesList(pagination.current, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return dataSource?.length ? (
    <div>
      <div className="flex mb-6">
        <div className="text-gray-700 text-500 font-bold">Cases</div>
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
          scroll={{ x: 1000 }}
          onChange={onChangeCase}
          pagination={pagination}
          className="mb-4"
        ></Table>
      </div>
      <Alert></Alert>
    </div>
  ) : (
    <div className="justify-center pb-[200px] align-center relative flex flex-col justify-center overflow-hidden px-32 py-10 bg-white">
      <img alt="noData" className="w-96 h-auto m-auto" src={nodata}></img>
      <p className="text-center mb-8">
        {" "}
        No cases found. Please create a new case
      </p>
      <button
        type="submit"
        className="m-auto text-white bg-black hover:bg-gray-800 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-cente"
        onClick={createNew}
      >
        Create new
      </button>
    </div>
  );
};
export default Cases;
