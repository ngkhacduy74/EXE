import axios from "axios"; 

const getUserByEmail = (email) => {
  const URL_BACKEND = "http://localhost:4000/auth/getUserByEmail";
  return axios.get(URL_BACKEND, { params: { email } });
};

export default getUserByEmail;