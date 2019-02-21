import Mock from 'mockjs';

const userList = Mock.mock({
  'data|86': [
    {
      'id': /^[1-9]\d{6}/,
      'storeId': /^[1-9]\d{2,5}/,
      "followStoreName": '@cname',
      "followStoreId|+1": 1,
      "followStatus|1": [1, 2],
      "gender|1": ['1', '2'],
      "nickName": '@cname',
      "realName": '@cname',
      "registerStoreName": '@cname',
      "openId": '@word(15)',
      "totalScore": '@integer(50,100)',
      "alreadyBuyStoresStr": '@word(5)',
      "alreadyBuyStores": null,
      "avatar": '@url',
      'birthday': '@date',
      'memberGroupVOList': null,
      "memberGroups": null,
      "memberGroupsStr": '@word(4)',
      "memberStatus|1": [0, 1],
      "mobileNo": /^1[385][1-9]\d{8}/,
      "tagsStr": '@word(3)',
      "tags": null,
      "tagVOList": null,
      "gmtCreate": '@datetime',
      "gmtModified": '@datetime',
      "registerTime": '@datetime',
      "followTime": '@datetime',
      "creatorId|1-200": 1,
      "creatorName": '@name',
      "updatorId|1-200": 1,
      "updatorName": '@name',
      "unionId": /^[1-9]\d{2,4}/
    }]
});

export default {
  'GET /api/member/member': (req, res) => {
    let resData = {
      content: [],
      pages: 1,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      last: false
    };
    const { query } = req
    let { rows, page } = query;
    resData.pageNum = page ? parseInt(page, 10) : 1;
    resData.pageSize = rows || 10;
    resData.content = userList.data.slice((resData.pageNum - 1) * resData.pageSize, resData.pageNum * resData.pageSize);
    resData.pages = Math.ceil(userList.data.length / resData.pageSize);
    resData.total = userList.data.length;
    resData.last = resData.pages === resData.page ? true : false;
    res.status(200).json({ status: 0, msg: "SUCCESS", data: resData });
  },
}
