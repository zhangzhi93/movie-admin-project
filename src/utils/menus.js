export const MenuList = [{
  key: 'Index',
  path: '/Index/Home',
  name: '首页',
  icon: 'home',
  MenuList: [{
    type: "2",
    key: 'Home',
    name: '首页',
  }]
}, {
  key: 'StoreManage',
  path: '/StoreManage/Store',
  name: '门店管理',
  icon: 'shop',
  MenuList: [{
    type: "2",
    key: 'Store',
    name: '门店管理',
  }]
}, {
  key: 'Member',
  path: '/Member/UserList',
  name: '用户管理',
  icon: 'user',
  MenuList: [{
    type: "1",
    key: 'UserList',
    path: '/Member/UserList',
    name: '用户列表',
  }, {
    type: "1",
    key: 'OrderList',
    path: '/Member/OrderList',
    name: '订单列表',
  }, {
    type: "1",
    key: 'GroupList',
    path: '/Member/GroupList',
    name: '用户组别',
  }, {
    type: "1",
    key: 'TagList',
    path: '/Member/TagList',
    name: '用户标签',
  }]
}, {
  key: 'Tweets',
  path: '/Tweets/ImageText',
  name: '推文管理',
  icon: 'book',
  MenuList: [{
    type: "1",
    key: 'ImageText',
    path: '/Tweets/ImageText',
    name: '图文管理',
  }, {
    type: "1",
    key: 'Images',
    path: '/Tweets/Images',
    name: '图片管理',
  }, {
    type: "1",
    key: 'TypesList',
    path: '/Tweets/TypesList',
    name: '分类管理',
  }, {
    type: "1",
    key: 'Auditing',
    path: '/Tweets/Auditing',
    name: '审核列表',
  }]
}, {
  key: 'Message',
  path: '/Message/GroupSend',
  name: '消息中心',
  icon: 'message',
  MenuList: [{
    type: "1",
    key: 'GroupSend',
    path: '/Message/GroupSend',
    name: '群发素材',
  }, {
    type: "2",
    key: 'Wechat',
    name: '微信配置',
    MenuList: [{
      type: "1",
      key: 'MenuList',
      path: '/Message/MenuList',
      name: '菜单列表',
    }, {
      type: "1",
      key: 'Keyword',
      path: '/Message/Keyword',
      name: '关键词回复',
    }, {
      type: "1",
      key: 'FollowReply',
      path: '/Message/FollowReply',
      name: '被关注回复',
    }]
  }, {
    type: "1",
    key: 'GroupMessage',
    path: '/Message/GroupMessage',
    name: '群发短信',
  }]
}, {
  key: 'System',
  path: '/System/Account',
  name: '系统管理',
  icon: 'setting',
  MenuList: [{
    type: "1",
    key: 'Account',
    path: '/System/Account',
    name: '账号管理',
  }, {
    type: "1",
    key: 'Role',
    path: '/System/Role',
    name: '角色管理',
  }, {
    type: "1",
    key: 'PowerPoints',
    path: '/System/PowerPoints',
    name: '功能点管理',
  }, {
    type: "1",
    key: 'SmsConfig',
    path: '/System/SmsConfig',
    name: '短信配置管理',
  }]
},]

export function SubmenuArr() {
  let sublist = {};
  MenuList.forEach(element => {
    element.MenuList.forEach(item => {
      sublist[element.path + item.path] = item.name
    })
  });
  return sublist;
}
