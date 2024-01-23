import { useEffect, useState } from "react";
import useAuthToken from "../hooks/useAuthToken";
import { loginUser, forgotPassword, resetPassword } from "../services/api/useUser";
import { useLocation, useNavigate } from "react-router-dom";
import cover from "../assets/image-cover.webp";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import lawFirm from "../assets/lawFirm-illustration.svg";
import Cookies from "js-cookie";
import useAlert from "../components/Alert/useAlert";

const Login = () => {
  const initialValues = { email: "", password: "", customerCodeValue: "" };
  const { setAuthToken } = useAuthToken();
  const { showAlert, Alert } = useAlert();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetPwd, setResetPwd] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const customerCode = new URLSearchParams(location.search).get("cc");

  useEffect(() => {
    if(customerCode) {
    window.sessionStorage.setItem("customerCode", customerCode);
    }
  }, [customerCode]);

  const handleLogin = async () => {
    if(formValues?.customerCodeValue) {
        window.sessionStorage.setItem("customerCode", formValues.customerCodeValue);
    }
    await loginUser({
      customer_code: customerCode ? customerCode : formValues.customerCodeValue,
      email: formValues.email,
      password: formValues.password,
    })
      .then((response) => 
      Promise.all(setAuthToken(response.token), navigate("/clients")))
      .catch(() => showAlert("Opps! Login Failed, please try again", "error", 8000));
  };
  const forgetPassword = () => {
    setIsForgotPassword(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    setFormErrors(validate(formValues));
    if(Object.keys(formErrors).length !== 0) return;
    handleLogin();
  };
  const resetPasswordClick = () => {
    setResetPwd(true);
    setIsForgotPassword(false);
    forgotPassword(formValues.email)
      .then((response) => 
        Cookies.set('resetPwdKey', response.key),
        setResetPwd(true)
      )
      .catch(() => showAlert("Opps! reset password failed, please try again", "error", 8000));
  }
  const handleResetPassword = () => {
    resetPassword({password: formValues.password})
      .then(() => 
        Cookies.remove('resetPwdKey'),
        setResetPwd(false),
        setIsForgotPassword(false)
      )
      .catch(() => showAlert("Opps! reset password failed, please try again", "error", 8000));
  }
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
        setFormErrors('');
    }
  }, [formErrors, isSubmit]);

  const validate = (values) => {
    const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/i;
    if (!values.email) {
      formErrors.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
        formErrors.email = "Email is not valid";
    }
    if (!values.password) {
        formErrors.password = "Password is required";
    }
    if(!customerCode && !values.customerCodeValue) {
        formErrors.customerCode = "Customer Code is required"
    }
    return formErrors;
  };
  return (
    <div className="container flex h-screen">
      <section className="flex flex-col flex-1 px-20 bg-black justify-center items-center">
        <img className='m-4 w-[100px] h-[100px] rounded-full mb-10' alt='logo' src={cover}></img>
        {(isForgotPassword && !resetPwd) && (
            <form className="bg-white p-5 max-w-2xl w-full mx-auto rounded-2xl shadow-z1">
                <p className="text-500 text-center font-bold">Forgot Your Password?</p>
                <p className="text-300 text-center font-bold mb-5">No worries! Please enter your email address associated with your account.</p>
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                    <input type="email" name="email" value={formValues.email} required onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" placeholder="name@casack.com" />
                    <p className="text-red-400">{formErrors.email}</p>
                </div>
                <div className="flex flex-row justify-between">
                    <button type="button" onClick={resetPasswordClick} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Reset password</button>
                </div>
            </form>
        )}
        {(resetPwd && !isForgotPassword) && (
            <form className="bg-white p-5 max-w-2xl w-full mx-auto rounded-2xl shadow-z1">
                <p className="text-500 text-center font-bold">Create a new password</p>
                <p className="text-300 text-center font-bold mb-5">To complete the password reset process, please create a new password for your account.</p>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Your new password</label>
                    <input type="password" name="password" value={formValues.password} required onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" placeholder="new password" />
                    <p className="text-red-400">{formErrors.password}</p>
                </div>
                <div className="flex flex-row justify-between">
                    <button type="button" onClick={handleResetPassword} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Reset password</button>
                </div>
            </form>
        )}
        {(!isForgotPassword && !resetPwd) && (
            <form className="bg-white p-5 max-w-2xl w-full mx-auto rounded-2xl shadow-z1">
                <p className="text-500 text-center font-bold mb-5">LOGIN TO CASACK</p>
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                    <input type="email" name="email" value={formValues.email} required onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" placeholder="name@casack.com" />
                    <p className="text-red-400">{formErrors?.email}</p>
                </div>
                {
                    !customerCode && 
                    <div className="mb-5">
                        <label htmlFor="customerCodeValue" className="block mb-2 text-sm font-medium text-gray-900">Customer code</label>
                        <input type="text" name="customerCodeValue" value={formValues.customerCodeValue} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" placeholder="your customer code" />
                        <p className="text-red-400">{formErrors.customerCode}</p>
                    </div>
                }
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Your Password</label>
                    <input type={passwordVisible ? 'text' : 'password'} name="password" value={formValues.password} required onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" placeholder="password" />
                    { passwordVisible && 
                      <EyeInvisibleFilled className="relative m-auto mr-[10px] float-right top-[-30px]" onClick={togglePasswordVisibility}/>
                    }
                    {
                      !passwordVisible && 
                      <EyeFilled className="relative m-auto mr-[10px] float-right top-[-30px]" onClick={togglePasswordVisibility}/>
                    }
                    <p className="text-red-400">{formErrors.password}</p>
                </div>
                <div className="flex flex-row justify-between">
                    <button type="button" onClick={handleSubmit} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Login</button>
                    <p className="float-right text-300 mt-3" onClick={forgetPassword}>
                        Forgot Password?
                    </p>            
                </div>
            </form>
        )}
        
      </section>
      <section className="justify-center pb-[200px] align-center flex-2 relative flex flex-col justify-center overflow-hidden px-32 py-10 bg-white">
        <div className="text-700 font-bold">Welcome to Casack</div>
        <em className="text-400 mb-12">(Streamline Your Legal Practice with Casack, the Ultimate Law Firm Management Software)</em>
        <ul className="mb-20">
            <li className="mb-6 text-400">Streamline case organization, track progress, and manage deadlines with a user-friendly dashboard.</li>
            <li className="mb-6 text-400">Centralized repository, version control, and secure sharing for efficient document handling.</li>
            <li className="mb-6 text-400">Comprehensive client profiles, appointment scheduling, and a secure client portal for enhanced communication.</li>
        </ul>
        <img alt="illustration" className="absolute w-96 h-auto bottom-0 right-0 " src={lawFirm}></img>
      </section>
      <Alert></Alert>
    </div>
  );
};

export default Login;
