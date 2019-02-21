import Mock from 'mockjs';

const tagList = Mock.mock({
  'data|18': [
    {
      'id': /^[1-9]\d{2,5}/,
      "name": '@cname',
      "listTagConditionVO": []
    }]
});

export default {
  'GET /api/member/tag/option': (req, res) => {
    res.status(200).json({ status: 0, msg: "SUCCESS", data: tagList.data });
  },
}
