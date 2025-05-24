import axios from "axios";

const verifyOTPApi = (email, otp) => {
  const URL_BACKEND = "http://localhost:4000/otp/verifyOTP";

  const data = {
    email: email,
    otp: otp,
  };
  console.log("akajsd", data);
  return axios.get(URL_BACKEND, { params: data });
};
export default verifyOTPApi;
