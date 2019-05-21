//引入服务端接口
import { getStoreList, addStore, getStoreById, updateStore, getStoreByUser, importStore, getStoreOption, getStoreCodeById, downloadTemplet, getStoreManageById } from '../services/storeManage';

export default {
  namespace: 'storeManage',
  state: {
    getStoreListData: {
      content: [],
      last: true,
      pageNum: 1,
      pageSize: 20,
      pages: 1,
      total: 0
    },
    getStoreByIdData: {},
    getStoreOptionData: [],
    getStoreManageByIdData: {},
    loading: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {

      });
    },
  },

  effects: {
    *getStoreList({ payload }, { call, put }) {
      const { data } = yield call(getStoreList, payload);
      if (data && data.msg === 'SUCCESS') {
        yield put({ type: 'save', payload: { getStoreListData: data.data } });
      }
    },
    *getStoreManageById({ payload, callback }, { call, put }) {
      const { data } = yield call(getStoreManageById, payload);
      if (data && data.msg === 'SUCCESS') {
        if (callback) callback(data.data);
      }
    },
    *getStoreCodeById({ payload, callback }, { call, put }) {
      const { data } = yield call(getStoreCodeById, payload);
      if (data && data.msg === 'SUCCESS') {
        if (callback) callback(data.data);
      }
    },
    // 新增
    *addStore({ payload, callback }, { call, put }) {  // eslint-disable-line
      const { data } = yield call(addStore, payload);
      if (callback) callback(data);
    },

    *getStoreById({ payload, callback }, { call, put }) {  // eslint-disable-line
      const { data } = yield call(getStoreById, payload);
      if (data && data.msg === 'SUCCESS') {
        if (callback) callback(data);
        yield put({ type: 'save', payload: { getStoreByIdData: data.data } });
      }
    },
    *updateStore({ payload, callback }, { call, put }) {  // eslint-disable-line
      const { data } = yield call(updateStore, payload);
      if (callback) callback(data);
    },
    *getStoreByUser({ payload }, { call, put }) {  // eslint-disable-line
      const { data } = yield call(getStoreByUser, payload);
      if (data && data.msg === 'SUCCESS') {
        yield put({ type: 'save', payload: { getStoreListData: data.data } });
      }
    },
    *getStoreOption({ payload }, { call, put }) {  // eslint-disable-line
      const { data } = yield call(getStoreOption, payload);
      if (data && data.msg === 'SUCCESS') {
        yield put({ type: 'save', payload: { getStoreOptionData: data.data } });
      }
    },
    *downloadTemplet({ payload, callback }, { call, put }) {  // eslint-disable-line
      const { data } = yield call(downloadTemplet, payload);
      if (callback) callback(data);
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
}
