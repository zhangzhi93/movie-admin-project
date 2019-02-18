import { getProvinces, getCitys, getCountys, getStoreCitys } from '../services/app';
import { MenuList } from '../utils/menus';

export default {
  namespace: 'app',

  state: {
    urltomenu: {
      firstMenuObj: {
        key: 'Index',
        name: '首页'
      },
      secondMenuObj: {
        key: '',
        name: ''
      },
    },
    Provinces: [],
    Citys: [],
    Countys: [],
    storeCountys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'urltomenu',
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
    urltomenu(state, { payload }) {
      debugger;
      const pathname = payload.pathname.split('/');
      const firstMenuObj = MenuList.find(item => item.key === (pathname[1] ? pathname[1] : 'Index'));
      const secondMenuObj = firstMenuObj.MenuList.find(item => item.key === (pathname[2] ? pathname[2] : firstMenuObj.key));
      const urltomenu = {
        firstMenuObj,
        secondMenuObj
      }
      return { ...state, urltomenu };
    }
  }
};
