import { getProvinces, getCitys, getCountys, getStoreCitys } from '../services/app';

export default {
  namespace: 'app',

  state: {
    firstMenuKey: 'Index',
    secondMenuKey: '',
    subMenuList: [{ url: '/index/setting', name: '首页', isActive: true }],
    Provinces: [],
    Citys: [],
    Countys: [],
    storeCountys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const pathname = location.pathname.split('/');
        dispatch({
          type: 'save',
          payload: {
            firstMenuKey: pathname[1],
            secondMenuKey: pathname[2]
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
    }
  }
};
