export default {
  namespace: 'app',

  state: {
    selectedMenuArray: [],
    breadcrumb: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'urlToMenu',
          payload: {
            pathname: location.pathname
          },
        });
      });
    },
  },

  effects: {

  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    urlToMenu(state, { payload }) {
      let selectedMenuArray = payload.pathname.split('/');
      selectedMenuArray.shift();
      selectedMenuArray = selectedMenuArray[0] ? selectedMenuArray : ['usergroup'];
      return { ...state, selectedMenuArray };
    }
  }
};
