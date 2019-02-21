import { getMemberOrderList, exportMemberOrderList, getMemberOrderPlatform } from '../../services/Member/order';

export default {
  namespace: 'memeberOrder',

  state: {
    loading: false,
    getMemberOrderListData: {
      content: [],
      last: true,
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 0
    },
    getMemberOrderPlatformData: []
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
    *getMemberOrderList({ payload }, { call, put }) {
      const { data } = yield call(getMemberOrderList, payload);
      if (data && data.status === 0) {
        yield put({ type: 'save', payload: { getMemberOrderListData: data.data } });
      }
    },
    *exportMemberOrderList({ payload, callback }, { call }) {
      const { data } = yield call(exportMemberOrderList, payload);
      if (callback) callback(data);
    },
    //
    *getMemberOrderPlatform({ payload, callback }, { call, put }) {
      const { data } = yield call(getMemberOrderPlatform, payload);
      if (data && data.status === 0) {
        if (callback) callback(data);
        yield put({ type: 'save', payload: { getMemberOrderPlatformData: data.data } });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
