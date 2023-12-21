import { useState, useEffect } from "react";
import { getAllCases } from "../../services/api/useUser";
import { useNavigate, Link } from "react-router-dom";
import '../../index.css';
import nodata from "../../assets/nodata.svg";
import { Table, Pagination, Space } from "antd";
import useAlert from "../Alert/useAlert";

const Cases = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { showAlert, Alert } = useAlert();
  const [dataSource, setDataSource] = useState([]);
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
    2: "Deleted",
  };
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
      title: "Title",
      dataIndex: "title",
      key: "title",
      fixed: "left",
      width: 100,
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
        <Space size="middle">
          <Link to={`/caseData/${record.key}`} className="">
            Edit
          </Link>
        </Space>
      ),
    },
  ];
  const getCasesList = async () => {
    setLoading(true);
    await getAllCases()
      .then((response) => response.data)
      .then((responseJson) => {
        console.log(responseJson);
        const results = responseJson.map((row) => ({
          key: row._id,
          title: row.title,
          Description: row.Description,
          case_type: caseType[row.case_type],
          oppositionName: row.opposition.name,
          oppositionContact: row.opposition.phone,
          oppositionEmail: row.opposition.email,
          oppositionLawyerEmail: row.opposition_lawyer.email,
          oppositionLawyer: row.opposition_lawyer.name,
          oppositionLawyerContact: row.opposition_lawyer.phone,
          status: caseStatus[row.status],
          oppType: oppositiontype[row.opposition.type],
          courtType: courtType[row.court_type],
        }));
        console.log(results);
        setDataSource(results);
        setLoading(false);
      })
      .catch(() => showAlert("Oops! No data found!", "error", 8000));
  };
  function createNew() {
    navigate("/caseData");
  }
  useEffect(() => {
    getCasesList();
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
          <Alert></Alert>
        </>
      )}
      {dataSource?.length && (
        <>
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
              dataSource={currentPageData}
              bordered
              className="mb-4"
              scroll={{
                x: 1300,
              }}
              pagination={false}
            ></Table>
            <Pagination
              className="float-right"
              {...paginationConfig}
              total={dataSource.length}
            />
          </div>
        </>
      )}
    </>
  );
};
export default Cases;
