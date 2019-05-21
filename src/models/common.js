import { loginIn, loginOut, getProvinces, getCitys, getCountys, getStoreCitys } from '../services/common';

export default {
  namespace: 'common',

  state: {
    Provinces: [],
    Citys: [],
    Countys: [],
    storeCountys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {

      });
    },
  },

  effects: {
    *loginIn({ payload, callback }, { call, put }) {
      const { data } = yield call(loginIn, payload);
      if (callback) callback(data);
    },
    *loginOut({ payload, callback }, { call, put }) {
      const { data } = yield call(loginOut, payload);
      if (callback) callback(data);
    },
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
  },
};
