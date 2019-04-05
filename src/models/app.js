import { getProvinces, getCitys, getCountys, getStoreCitys } from '../services/app';
import { MenuList } from '../utils/menus';

export default {
  namespace: 'app',

  state: {
    urlToMenu: {
      MenuItem: {},
      urlMenuArr: [],
      depper: 1
    },
    breadcrumb: [],
    Provinces: [],
    Citys: [],
    Countys: [],
    storeCountys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'urlToMenu',
          payload: {
            pathname: location.pathname
          },
        });
      });
    },
  },

  effects: {

    *getProvinces({ payload, callback }, { call, put }) {
      const { data } = yield call(getProvinces, payload);
      if (callback) callback(data);
      yield put({ type: 'save', payload: { Provinces: data.data } });
    },

    *getCitys({ payload, callback }, { call, put }) {
      const { data } = yield call(getCitys, payload);
      if (data.data) {
        if (callback) callback(data);
        yield put({ type: 'save', payload: { Citys: data.data } });
      }
    },

    *getCountys({ payload, callback }, { call, put }) {
      const { data } = yield call(getCountys, payload);
      if (data.data) {
        if (callback) callback(data);
        yield put({ type: 'save', payload: { Countys: data.data } });
      }
    },

    *getStoreCitys({ payload, callback }, { call, put }) {
      const { data } = yield call(getStoreCitys, payload);
      yield put({ type: 'save', payload: { storeCountys: data.data } });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    urlToMenu(state, { payload }) {
      const urlMenu = payload.pathname.split('/.')[0];
      const urlMenuArr = urlMenu.split('/');
      urlMenuArr.shift();
      const MenuItem = MenuList.find(item => item.key === (urlMenuArr[0] ? urlMenuArr[0] : 'Index'));
      //
      const urlToMenu = {
        MenuItem,
        urlMenuArr,
      }
      return { ...state, urlToMenu };
    }
  }
};
