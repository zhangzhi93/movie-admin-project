import Mock from 'mockjs';

const groupList = Mock.mock({
  'data|18': [
    {
      'id': /^[1-9]\d{2,5}/,
      "name": '@cname'
    }]
});

export default {
  'GET /api/member/member-group/option': (req, res) => {
    res.status(200).json({ status: 0, msg: "SUCCESS", data: groupList.data });
  },
}
