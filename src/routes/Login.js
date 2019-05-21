import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Icon, message, Checkbox, Button, Input, Form, Layout } from 'antd';
import styles from './style.less';
import FormItem from 'antd/lib/form/FormItem';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {

    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form: { validateFields }, dispatch } = this.props;
    validateFields((err, values) => {
      if (err) {
        return;
      }

      var payload = {};
      payload.loginName = values.loginName;
      payload.password = values.password;

      dispatch({
        type: 'login/loginIn',
        payload: payload,
        callback: (res) => {
          if (res.msg == 'SUCCESS') {
            message.success("登陆成功");
            // instance.defaults.headers.common['CsrfToken'] = Cookies.get('XSRF-TOKEN', { domain: 'crland.com.cn' });
            dispatch({
              type: 'common/getAuthorizeMenuList',
              callback: res => {
                if (res.msg == 'SUCCESS') {
                  localStorage.setItem('userType', res.data.userType);
                  if (res.data.userType == 1) {
                    localStorage.setItem('storeId', res.data.storeId);
                  }
                  dispatch(routerRedux.replace('/'));
                }
              }
            })

          } else {
            message.error(res.msg);
          }
        }
      })
    });
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Layout>
        <div style={{ height: 150, lineHeight: '150px', textAlign: 'center', fontSize: '28px' }}>万象影城用户平台系统</div>
        <Form onSubmit={this.handleSubmit} className={styles.login_form}>
          <FormItem>
            {getFieldDecorator('loginName', {
              rules: [{ required: true, message: '请输入用户名!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入用户名" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" />
            )}
          </FormItem>
          <FormItem>
            <Checkbox className={styles.Checkbox}>30天内自动登陆</Checkbox>
            <Button type="primary" htmlType="submit" className={styles.login_button}>
              登陆
          </Button>
          </FormItem>
        </Form>
      </Layout>
    );
  }
}

Login.propTypes = {
};

function mapStateToProps({ login, common }) {
  return {
    login,
    common
  };
}

const WrappedLogin = Form.create()(Login);

export default connect(mapStateToProps)(WrappedLogin);
