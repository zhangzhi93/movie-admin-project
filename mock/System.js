import Mock from 'mockjs';
import { cityArray } from './Public';

const cityObj = Mock.mock({
  'data|14': [
    {
      'id': /^[1-9]\d{2}/,
      "name|1": cityArray,
      "provinceId|1-31": 1,
      "code": /^[1-9]\d{6}/
    }]
});

export default {
  'GET /api/system/city/accord-store-bind': (req, res) => {
    res.status(200).json({ status: 0, msg: "SUCCESS", data: cityObj.data });
  },
}
