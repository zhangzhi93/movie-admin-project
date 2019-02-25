import Mock from 'mockjs';

const userList = Mock.mock({
  'data|24': [{
    'classifyId': /^[1-9]\d{2,3}/,
    'classifyName': '@cname',
    'name': '@title',
    'imageUrl': '@image',
    'wechatUrl': '@image',
    'wechatMediaId': '@guid',
    'gmtCreate': '@datetime',
    'gmtModified': '@datetime',
    'creatorId': /^[1-9]\d{3}/,
    'updatorId': /^[1-9]\d{3}/,
    'creatorName': '@cname',
    'updatorName': '@cname',
    'id': /^[1-9]\d{3}/,
  }]
});

export default {
  'GET /api/tweet/image': (req, res) => {
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
