//引入服务端接口
import { getUserList, getUserById, updateUser, freeze, freezeById, exportUserList, recoverById, updateUserBatch,updateUserBatchAll } from "../../services/Member/user";

export default {
  namespace: 'memberUser',
  state: {
    getUserListData: {
      content: [],
      last: true,
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 0
    },
    getUserByIdData: {},
    getStoreOptionData: [],
    loading: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const pathname = location.pathname;
      });
    },
  },

  effects: {
    *getUserList({ payload }, { call, put }) {
      const { data } = yield call(getUserList, payload);
      if (data && data.msg === 'SUCCESS') {
        yield put({ type: 'save', payload: { getUserListData: data.data } });
      }
    },

    *getUserById({ payload, callback }, { call, put }) {  // eslint-disable-line
      const { data } = yield call(getUserById, payload);
      if (data && data.msg === 'SUCCESS') {
        if (callback) callback(data);
        yield put({ type: 'save', payload: { getUserByIdData: data.data } });
      }
    },
    *updateUser({ payload, callback }, { call, put }) {  // eslint-disable-line
      const { data } = yield call(updateUser, payload);
      if (callback) callback(data);
    },

    *freeze({ payload, callback }, { call, put }) {  // eslint-disable-line
      const { data } = yield call(freeze, payload);
      if (callback) callback(data);
    },

    // 会员加入分组
    *updateUserBatch({ payload, callback }, { call, put }) {  // eslint-disable-line
      const { data } = yield call(updateUserBatch, payload);
      if (callback) callback(data);
    },

    // 批量会员加入分组
    *updateUserBatchAll({ payload, callback }, { call, put }) {  // eslint-disable-line
      const { data } = yield call(updateUserBatchAll, payload);
      if (callback) callback(data);
    },

    *freezeById({ payload, callback }, { call, put }) {  // eslint-disable-line
      const { data } = yield call(freezeById, payload);
      if (callback) callback(data);
    },

    *recoverById({ payload, callback }, { call, put }) {  // eslint-disable-line
      const { data } = yield call(recoverById, payload);
      if (callback) callback(data);
    },

    *exportUserList({ payload, callback }, { call, put }) {  // eslint-disable-line
      const { data } = yield call(exportUserList, payload);
      if (callback) callback(data);
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
}
