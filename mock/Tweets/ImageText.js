import Mock from 'mockjs';

const userList = Mock.mock({
  'data|38': [
    {
      'wechatMediaId': '@guid',
      'imageTextItemList|3-6': [
        {
          'imageTextId': /^[1-9]\d{5}/,
          'classifyId': /^[1-9]\d{2,3}/,
          'classifyName': '@cname',
          'title': '@title',
          'author': '@cname',
          'abstractStr': '@sentence',
          'externalUrl': '@url',
          'wechatUrl': '@image',
          'coverUrl': '@image',
          'contentType|1': [0, 1],
          'wechatMediaId': '@guid',
          'articleDetail': '@paragraph(2)',
          'gmtCreate': '@datetime',
          'gmtModified': '@datetime',
          'creatorId': /^[1-9]\d{3}/,
          'updatorId': /^[1-9]\d{3}/,
          'creatorName': '@cname',
          'updatorName': '@cname',
          'id': /^[1-9]\d{3}/,
        }
      ],
      "gmtCreate": '@datetime',
      "gmtModified": '@datetime',
      'creatorId': /^[1-9]\d{3}/,
      'updatorId': /^[1-9]\d{3}/,
      'creatorName': '@cname',
      'updatorName': '@cname',
      'id': /^[1-9]\d{3}/,
    }]
});

export default {
  'GET /api/tweet/image-text-group-not-rich': (req, res) => {
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
