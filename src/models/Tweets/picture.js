import { getImageList, addImage, getImageById, updateImage, deleteImage } from '../../services/Tweets/picture';

export default {
  namespace: 'images',

  state: {
    loading: false,
    getImageListData: {
      content: [],
      last: true,
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 0
    },
    getImageByIdData: {}
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
    *getImageList({ payload, callback }, { call, put }) {
      const { data } = yield call(getImageList, payload);
      if (data && data.status === 0) {
        yield put({ type: 'save', payload: { getImageListData: data.data } });
      }
      if (callback) callback(data);
    },
    *addImage({ payload, callback }, { call }) {
      const { data } = yield call(addImage, payload);
      if (callback) callback(data);
    },
    //
    *getImageById({ payload, callback }, { call, put }) {
      const { data } = yield call(getImageById, payload);
      if (data && data.status === 0) {
        yield put({ type: 'save', payload: { getImageByIdData: data.data } });
      }
      if (callback) callback(data);
    },
    // 修改
    *updateImage({ payload, callback }, { call }) {
      const { data } = yield call(updateImage, payload);
      if (callback) callback(data);
    },
    //
    *deleteImage({ payload, callback }, { call }) {
      const { data } = yield call(deleteImage, payload);
      if (callback) callback(data);
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
