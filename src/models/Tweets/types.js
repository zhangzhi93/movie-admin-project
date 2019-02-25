import { getClassifyList, addClassify, getClassifyById, updateClassify, deleteClassify, getClassifyOption } from '../../services/Tweets/types';

export default {
  namespace: 'types',

  state: {
    loading: false,
    getClassifyListData: {
      content: [],
      last: true,
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 0
    },
    getClassifyByIdData: {},
    getClassifyOptionData:[]
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const pathname = location.pathname;
        if (pathname === '/System') {
        }
      });
    },
  },

  effects: {
    // 查询角色
    *getClassifyList({ payload }, { call, put }) {
      const { data } = yield call(getClassifyList, payload);
      if (data && data.status === 0) {
        yield put({ type: 'save', payload: { getClassifyListData: data.data } });
      }
    },
    *addClassify({ payload, callback }, { call }) {
      const { data } = yield call(addClassify, payload);
      if (callback) callback(data);
    },
    //
    *getClassifyById({ payload, callback }, { call, put }) {
      const { data } = yield call(getClassifyById, payload);
      if (data && data.status === 0) {
        if (callback) callback(data);
        yield put({ type: 'save', payload: { getClassifyByIdData: data.data } });
      }
    },
    // 修改
    *updateClassify({ payload, callback }, { call }) {
      const { data } = yield call(updateClassify, payload);
      if (callback) callback(data);
    },
    //
    *deleteClassify({ payload, callback }, { call }) {
      const { data } = yield call(deleteClassify, payload);
      if (callback) callback(data);
    },
    //
    *getClassifyOption({ payload }, { call, put }) {
      const { data } = yield call(getClassifyOption, payload);
      if (data && data.status === 0) {
        yield put({ type: 'save', payload: { getClassifyOptionData: data.data } });
      }
    },

  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
