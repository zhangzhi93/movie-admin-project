import { getMemberGroupList, addMemberGroup, getMemberGroupById, updateMemberGroup, deleteMemberGroup, exportMemberGroupList, getMemberGroupOption } from '../../services/Member/group';

export default {
  namespace: 'memeberGroup',

  state: {
    loading: false,
    getMemberGroupListData: {
      content: [],
      last: true,
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 0
    },
    getMemberGroupByIdData: {},
    getMemberGroupOptionData:[]
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
    *getMemberGroupList({ payload }, { call, put }) {
      const { data } = yield call(getMemberGroupList, payload);
      if (data && data.status === 0) {
        yield put({ type: 'save', payload: { getMemberGroupListData: data.data } });
      }
    },
    *addMemberGroup({ payload, callback }, { call }) {
      const { data } = yield call(addMemberGroup, payload);
      if (callback) callback(data);
    },
    //
    *getMemberGroupById({ payload, callback }, { call, put }) {
      const { data } = yield call(getMemberGroupById, payload);
      if (data && data.status === 0) {
        if (callback) callback(data);
        yield put({ type: 'save', payload: { getMemberGroupByIdData: data.data } });
      }
    },
    // 修改
    *updateMemberGroup({ payload, callback }, { call }) {
      const { data } = yield call(updateMemberGroup, payload);
      if (callback) callback(data);
    },
    //
    *deleteMemberGroup({ payload, callback }, { call }) {
      const { data } = yield call(deleteMemberGroup, payload);
      if (callback) callback(data);
    },
    // 复制
    *exportMemberGroupList({ payload, callback }, { call }) {
      const { data } = yield call(exportMemberGroupList, payload);
      if (callback) callback(data);
    },
    //
    *getMemberGroupOption({ payload, callback }, { call, put }) {
      const { data } = yield call(getMemberGroupOption, payload);
      if (data && data.status === 0) {
        yield put({ type: 'save', payload: { getMemberGroupOptionData: data.data } });
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
