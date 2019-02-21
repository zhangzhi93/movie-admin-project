import Mock from 'mockjs';

const db = Mock.mock({
  'data|56': [
    {
      'id': /^[1-9]\d{6}/,
      "name": '@cname',
      "provinceId|1-31": 1,
      "provinceName": '@province',
      "cityId|1-100": 1,
      "cityName": '@city',
      "countyId|1-100": 1,
      "countyName": '@county',
      'address': '@county(true)',
      'age|18-32': 1,
      "contactMan": '@cname',
      "contactNumber": /^1[385][1-9]\d{8}/,
      "evaluateStatus|1": [0, 1],
      "serviceTelephone": /^1[385][1-9]\d{8}/,
      "description": '@sentence',
      "activityDetail": '@sentence',
      "xaxis": null,
      "yaxis": null,
      "gmtCreate": '@datetime',
      "gmtModified": '@datetime',
      "creatorId|1-200": 1,
      "creatorName": '@name',
      "updatorId|1-200": 1,
      "updatorName": '@name',
      "wechatTicket": null,
      "wechatQrcodeId": null,
      "imageVOList": null,
      "listImageUrl": null
    }]
});

const storeList = Mock.mock({
  'data|15': [
    {
      'id': /^[1-9]\d{2,5}/,
      "name": '@cname',
      "listImageUrl": '@url'
    }]
});

export default {
  'GET /api/store/store': (req, res) => {
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
  'GET /api/store/store/option': (req, res) => {
    res.status(200).json({ status: 0, msg: "SUCCESS", data: storeList.data });
  },
}
