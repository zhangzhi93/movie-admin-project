export default {
  name: '用户平台系统',
  footerText: 'Copyright © 2019 All Rights Reserved.',
  // -------  线上环境 -------------------------
  url: process.env.NODE_ENV === 'development' ? '' : '',
  profix: process.env.NODE_ENV === 'development' ? '' : '',
  CsrfToken: '',
  formItemLayout: {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }
};

// 读取param
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] === variable) { return pair[1]; }
  }
  return (false);
}
