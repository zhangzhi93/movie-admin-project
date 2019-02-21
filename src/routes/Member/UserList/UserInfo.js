import { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Form, Card, Select, message, Col, Icon, DatePicker, Input, Radio, Button, Checkbox, Upload, Switch, Breadcrumb } from 'antd';
import style from '../index.less';


const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
  },
};

class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { params: { id }, dispatch } = this.props;
    dispatch({
      type: 'memberUser/getUserById',
      payload: {
        id
      }
    });
    dispatch({
      type: 'memeberGroup/getMemberGroupOption'
    })
  }

  doSave = () => {
    const { params: { id }, dispatch, form: { validateFields }, history } = this.props;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log()
      dispatch({
        type: 'memberUser/updateUser',
        payload: {
          id,
          ...values
        },
        callback: res => {
          if (res.msg == 'SUCCESS') {
            message.success('编辑成功');
            history.goBack(1)
          }
        }
      })
    });
  }

  //
  render() {
    const { form, params, memeberGroup: { getMemberGroupOptionData }, memberUser: { getUserByIdData } } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className="template">
        <Breadcrumb separator=">>">
          <Breadcrumb.Item>用户管理</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-active">
            用户信息
          </Breadcrumb.Item>
        </Breadcrumb>
        <Card
          title="用户信息"
          extra={
            <div>
              <Button size="large" ghost onClick={() => this.props.history.goBack()}>取消</Button>
              <Button size="large" type="primary" ghost onClick={this.doSave}>提交</Button>
            </div>
          }
        >
          <Form>
            <FormItem {...formItemLayout} label="用户ID">
              <span>{getUserByIdData ? getUserByIdData.id : ''}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="手机号">
              <span>{getUserByIdData ? getUserByIdData.mobileNo : ''}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="注册影院">
              <span>{getUserByIdData ? getUserByIdData.registerStoreName : ''}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="注册时间">
              <span>{getUserByIdData ? getUserByIdData.registerTime : ''}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="微信openid">
              <span>{getUserByIdData ? getUserByIdData.openId : ''}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="是否关注">
              <span>{getUserByIdData ? getUserByIdData.followStatus == 1 ? '已关注' : '未关注' : ''}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="关注时间">
              <span>{getUserByIdData ? getUserByIdData.followTime : ''}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="姓名">
              <span>{getUserByIdData ? getUserByIdData.realName : ''}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="性别">
              <span>{getUserByIdData ? getUserByIdData.gender == 'M' ? '男' : '女' : ''}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="生日">
              <span>{getUserByIdData ? getUserByIdData.birthday : ''}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="用户标签">
              <span>{getUserByIdData && getUserByIdData.tagVOList ? getUserByIdData.tagVOList.map(item => item.name).join() : ''}</span>
            </FormItem>
            <FormItem label="选择分组" {...formItemLayout}>
              {getFieldDecorator('memberGroupIds', {
                initialValue: getUserByIdData && getUserByIdData.memberGroupVOList ? getUserByIdData.memberGroupVOList.map(item => item.id) : [],
              })(
                <Select
                  mode="multiple"
                  style={{ width: 260 }}
                  placeholder="请选择"
                >
                  {
                    getMemberGroupOptionData.map(item => {
                      return (
                        <Option value={item.id} key={item.id}>{item.name}</Option>
                      );
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}




UserInfo.propTypes = {};


function mapStateToProps({ memberUser, memeberGroup }) {
  return {
    memberUser, memeberGroup
  };
}

const WrappedUserInfo = Form.create()(UserInfo);

export default connect(mapStateToProps)(WrappedUserInfo);
