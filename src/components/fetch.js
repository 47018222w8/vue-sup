import axios from 'axios'
import constant from './constant'
axios.defaults.baseURL = constant.BASE_URL;
axios.defaults.headers.common[constant.JWT_HEADER] = localStorage.getItem(constant.JWT_HEADER);
export default  axios