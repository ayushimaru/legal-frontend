import useAuthToken from "../../hooks/useAuthToken";
import { logoutUserApi } from "../../services/api/useUser";
import { useNavigate, NavLink } from "react-router-dom";
import {
  FolderFilled,
  BookFilled,
  ContactsFilled,
  LogoutOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";

const SideBar = () => {
  const { removeAuthToken } = useAuthToken();
  const navigate = useNavigate();

  const logoutUser = () => {
    logoutUserApi()
      .then(() => removeAuthToken())
      .catch((error) => console.log(error));
    Cookies.remove("customerCode");
    navigate("/login");
  };
  return (
    <div>
      <button
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-black">
          <NavLink
            className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
            to={"/clients"}
          >
            {" "}
            <span className="self-center cursor-pointer text-[24px] font-semibold whitespace-nowrap text-white">
              Casack
            </span>
          </NavLink>
          <ul className="space-y-2 font-medium mt-2">
            {/* <li>
              <NavLink
                className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
                to={"/dashboard"}
                style={({ isActive }) =>
                  isActive
                    ? {
                        background: "#cccccc",
                        color: "black",
                      }
                    : {}
                }
              >
                {" "}
                <svg
                  className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Dashboard</span>
              </NavLink>
            </li> */}
            <li>
              <NavLink
                className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
                to={"/clients"}
                style={({ isActive }) =>
                  isActive
                    ? {
                        background: "#cccccc",
                        color: "black",
                      }
                    : {}
                }
              >
                {" "}
                <ContactsFilled />
                <span className="flex-1 ms-3 whitespace-nowrap">Clients</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
                to={"/cases"}
                style={({ isActive }) =>
                  isActive
                    ? {
                        background: "#cccccc",
                        color: "black",
                      }
                    : {}
                }
              >
                {" "}
                <BookFilled />
                <span className="flex-1 ms-3 whitespace-nowrap">Cases</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
                to={"/documents"}
                style={({ isActive }) =>
                  isActive
                    ? {
                        background: "#cccccc",
                        color: "black",
                      }
                    : {}
                }
              >
                {" "}
                <FolderFilled />
                <span className="flex-1 ms-3 whitespace-nowrap">Documents</span>
              </NavLink>
            </li>
            <li>
              <button
                onClick={logoutUser}
                className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group w-full"
              >
                <LogoutOutlined />
                <span className="ms-3 whitespace-nowrap">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default SideBar;
