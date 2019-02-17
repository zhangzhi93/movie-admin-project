import { loginIn, loginOut } from '../services/login';

export default {
  namespace: 'login',

  state: {
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
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
