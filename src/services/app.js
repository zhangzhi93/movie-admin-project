import axios from '../utils/axios';

export function getHomePageStatis() {
  return axios.get('/statis/group/home-page');
}

export function getStoreHomePageStatis() {
  return axios.get('/statis/store/home-page');
}






