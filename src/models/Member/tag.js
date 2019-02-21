import { getMemberTagList, addMemberTag, getMemberTagById, updateMemberTag, deleteMemberTag, getMemberTagOption } from '../../services/Member/tag';

export default {
  namespace: 'memeberTag',

  state: {
    loading: false,
    getMemberTagListData: {
      content: [],
      last: true,
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 0
    },
    getMemberTagByIdData: {},
    getMemberTagOptionData: []
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
    *getMemberTagList({ payload }, { call, put }) {
      const { data } = yield call(getMemberTagList, payload);
      if (data && data.status === 0) {
        yield put({ type: 'save', payload: { getMemberTagListData: data.data } });
      }
    },
    *addMemberTag({ payload, callback }, { call }) {
      const { data } = yield call(addMemberTag, payload);
      if (callback) callback(data);
    },
    //
    *getMemberTagById({ payload, callback }, { call, put }) {
      const { data } = yield call(getMemberTagById, payload);
      if (data && data.status === 0) {
        if (callback) callback(data);
        yield put({ type: 'save', payload: { getMemberTagByIdData: data.data } });
      }
    },
    // 修改
    *updateMemberTag({ payload, callback }, { call }) {
      const { data } = yield call(updateMemberTag, payload);
      if (callback) callback(data);
    },
    //
    *deleteMemberTag({ payload, callback }, { call }) {
      const { data } = yield call(deleteMemberTag, payload);
      if (callback) callback(data);
    },
    //
    *getMemberTagOption({ payload, callback }, { call, put }) {
      const { data } = yield call(getMemberTagOption, payload);
      if (data && data.status === 0) {
        yield put({ type: 'save', payload: { getMemberTagOptionData: data.data } });
        if (callback) callback(data);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
