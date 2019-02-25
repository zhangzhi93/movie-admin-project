import Mock from 'mockjs';

const db = Mock.mock({
  'data|24': [{
    'name': '@word',
    'description': '@sentence',
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
  'GET /api/tweet/classify': (req, res) => {
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
    resData.content = db.data.slice((resData.pageNum - 1) * resData.pageSize, resData.pageNum * resData.pageSize);
    resData.pages = Math.ceil(db.data.length / resData.pageSize);
    resData.total = db.data.length;
    resData.last = resData.pages === resData.page ? true : false;
    res.status(200).json({ status: 0, msg: "SUCCESS", data: resData });
  },
}
