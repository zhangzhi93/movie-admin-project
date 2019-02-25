import { getImageTextList, getImageTextNotRichList, addImageText, getImageTextById, updateImageText, deleteImageText, savePreviewImageText, PreviewImageText, PreviewWechatImageText } from '../../services/Tweets/imagetext';

export default {
  namespace: 'imagetext',

  state: {
    loading: false,
    getImageTextListData: {
      content: [],
      last: true,
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 0
    },
    getImageTextNotRichListData: {
      content: [],
      last: true,
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 0
    },
    getImageTextByIdData: {}
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
    // 查询图文列表
    *getImageTextList({ payload, callback }, { call, put }) {
      const { data } = yield call(getImageTextList, payload);
      if (data && data.status === 0) {
        yield put({ type: 'save', payload: { getImageTextListData: data.data } });
      }
      if (callback) callback(data);
    },
    //获取图文列表-分页
    *getImageTextNotRichList({ payload, callback }, { call, put }) {
      const { data } = yield call(getImageTextNotRichList, payload);
      if (data && data.status === 0) {
        yield put({ type: 'save', payload: { getImageTextNotRichListData: data.data } });
      }
      if (callback) callback(data);
    },
    *addImageText({ payload, callback }, { call }) {
      const { data } = yield call(addImageText, payload);
      if (callback) callback(data);
    },
    //保存预览推文
    *savePreviewImageText({ payload, callback }, { call }) {
      const { data } = yield call(savePreviewImageText, payload);
      if (callback) callback(data);
    },
    //
    *PreviewImageText({ payload, callback }, { call }) {
      const { data } = yield call(PreviewImageText, payload);
      if (callback) callback(data);
    },
    //
    *PreviewWechatImageText({ payload, callback }, { call }) {
      const { data } = yield call(PreviewWechatImageText, payload);
      if (callback) callback(data);
    },
    //
    *getImageTextById({ payload, callback }, { call, put }) {
      const { data } = yield call(getImageTextById, payload);
      if (data && data.status === 0) {
        yield put({ type: 'save', payload: { getImageTextByIdData: data.data } });
      }
      if (callback) callback(data);
    },
    // 修改
    *updateImageText({ payload, callback }, { call }) {
      const { data } = yield call(updateImageText, payload);
      if (callback) callback(data);
    },
    //
    *deleteImageText({ payload, callback }, { call }) {
      const { data } = yield call(deleteImageText, payload);
      if (callback) callback(data);
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
