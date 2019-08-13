import Mock from 'mockjs';
import { platformArray } from '../Public';

const orderList = Mock.mock({
  'data|152': [
    {
      'id': /^[1-9]\d{6}/,
      "mobileNo": /^1[385][1-9]\d{8}/,
      "orderTime": '@datetime',
      "orderStoreName": '@cname',
      "orderPlatform": '@word(4)',
      "filmAmount": '@float(20,150,1,2)',
      "orderNumber": '@integer(1,10)',
      "filmName": '@word(3,5)',
      "filmType|1": ['爱情片', '剧情片', '喜剧片', '家庭片', '伦理片', '文艺片', '音乐片', '歌舞片', '动漫片'],
      "filmDuration": '@integer(60,150)',
      "projectionStartTime": '@datetime',
      "projectionEndTime": '@datetime',
    }]
});

const platformList = Mock.mock({
  'data': platformArray.map(item => {
    return {
      'id': /^[1-9]\d{6}/,
      "orderPlatform|1": item,
    }
  })
});

export default {
  'GET /api/member/order': (req, res) => {
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
    resData.content = orderList.data.slice((resData.pageNum - 1) * resData.pageSize, resData.pageNum * resData.pageSize);
    resData.pages = Math.ceil(orderList.data.length / resData.pageSize);
    resData.total = orderList.data.length;
    resData.last = resData.pages === resData.page ? true : false;
    res.status(200).json({ status: 0, msg: "SUCCESS", data: resData });
  },
  'GET /api/member/order/platform': (req, res) => {
    res.status(200).json({ status: 0, msg: "SUCCESS", data: platformList.data });
  },
}
