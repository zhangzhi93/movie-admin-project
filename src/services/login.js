import axios from '../utils/axios';

export function loginIn(params) {
  return axios.post('/passport/login-admin', params);
}

export function loginOut() {
  return axios.get('/passport/passport/logout');
}



