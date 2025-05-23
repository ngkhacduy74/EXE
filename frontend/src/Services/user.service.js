import axios from "axios";

const getUserByEmail = (email) => {
  const URL_BACKEND = `${process.env.BACKEND_API}/user/getUserByEmail`;
  return axios.get(URL_BACKEND, { params: { email } });
};

export default getUserByEmail;
