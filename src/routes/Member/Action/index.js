import { Component } from 'react';
import { connect } from 'dva';
import { Layout, Button, Table, Card, Form, Row, Col, Input, DatePicker, Select, Breadcrumb, message } from 'antd';
import Modal from './Modal';
import style from '../index.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      searchParams: {},
      pagination: {
        page: 1,
        pageSize: 10,
      },
      groupInfoById: {
        id: '',
        name: '',
        description: ''
      }
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'memeberOrder/getMemberGroupList',
      payload: {
        page: 1,
        rows: 10
      }
    })
  }

  handleTableChange = (pagination) => {
    const { pageSize, current } = pagination;
    const { dispatch } = this.props;
    const { payload } = this.state;
    this.setState({
      pagination: {
        page: current,
        pageSize,
      },
    });
    const query = {
      ...payload,
      page: current,
      rows: pageSize,
    };
    // dispatch({
    //   type: 'shopActivity/get_activity',
    //   payload: query,
    // });
  }

  addGroup = (values, id) => {
    const { dispatch } = this.props;
    const { searchParams, pagination } = this.state;

    let url = 'memeberGroup/addMemberGroup';
    if (id) {
      url = 'memeberGroup/updateMemberGroup';
      values.id = id;
    }
    dispatch({
      type: url,
      payload: values,
      callback: (res) => {
        if (res && res.msg === 'SUCCESS') {
          message.success(`组别${id ? '更新' : '添加'}成功`);
          this.setState({
            visible: false
          })
          dispatch({
            type: 'memeberGroup/getMemberGroupList',
            payload: {
              ...searchParams,
              ...pagination
            }
          })
        } else {
          message.error(res.msg);
        }
      }
    })
  }

  close = () => {
    this.setState({
      visible: false
    })
  }

  editGroup = (id) => {
    const { dispatch } = this.props;
    if (id) {
      dispatch({
        type: 'memeberGroup/getMemberGroupById',
        payload: { id },
        callback: (res) => {
          if (res && res.msg === 'SUCCESS') {
            this.setState({
              visible: true,
              groupInfoById: {
                id: id,
                name: res.data.name,
                description: res.data.description
              }
            })
          }
        }
      })
    } else {
      this.setState({
        visible: true,
        groupInfoById: {
          id: '',
          name: '',
          description: ''
        }
      })
    }
  }

  deleteGroup = (id) => {
    const { dispatch } = this.props;
    const { searchParams, pagination } = this.state;
    dispatch({
      type: 'memeberGroup/deleteMemberGroup',
      payload: { id },
      callback: (res) => {
        if (res && res.msg === 'SUCCESS') {
          message.success("删除成功");
          dispatch({
            type: 'memeberGroup/getMemberGroupList',
            payload: {
              ...searchParams,
              ...pagination
            }
          })
        }
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { pagination } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        pagination: {
          ...pagination,
          page: 1
        },
        searchParams: values
      });
      const payload = {
        ...values,
        page: 1,
        rows: pagination.pageSize,
      };
      dispatch({
        type: 'memeberGroup/getMemberGroupList',
        payload,
      });
    });
  }

  render() {
    const { form, memeberGroup } = this.props;
    const { pagination, visible, groupInfoById } = this.state;
    const { getMemberGroupListData: { content, total } } = memeberGroup;
    const { getFieldDecorator } = form;
    const columns = [{
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '手机',
      dataIndex: 'mobile',
      key: 'mobile',
    }, {
      title: '购票时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
    }, {
      title: '购票影院',
      dataIndex: 'memberNumber',
      key: 'memberNumber',
    }, {
      title: '购票渠道',
      dataIndex: 'creatorName',
      key: 'creatorName',
    }, {
      title: '购票金额',
      dataIndex: 'updatorName',
      key: 'updatorName',
    }, {
      title: '购票张数',
      dataIndex: 'gmtModified',
      key: 'gmtModified'
    }, {
      title: '影片名称',
      dataIndex: 'gmtModified',
      key: 'gmtModified'
    }, {
      title: '影片类型',
      dataIndex: 'gmtModified',
      key: 'gmtModified'
    }, {
      title: '影片时长',
      dataIndex: 'gmtModified',
      key: 'gmtModified'
    }, {
      title: '放映时间',
      dataIndex: 'gmtModified',
      key: 'gmtModified'
    }];
    return (
      <Layout>
        <Breadcrumb separator=">>">
          <Breadcrumb.Item>用户管理</Breadcrumb.Item>
          <Breadcrumb.Item>订单列表</Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={6}>
                <FormItem label="手机号" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [

                    ]
                  })(
                    <Input maxLength="15" size="default" style={{ width: 180 }} placeholder="请输入手机号" />,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="购票时间" {...formItemLayout}>
                  {getFieldDecorator('activeTime')(
                    <RangePicker
                      style={{ width: 180 }}
                      format="YYYY-MM-DD hh:mm:ss"
                      showTime
                      size="default"
                      getCalendarContainer={trigger => trigger.parentNode}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem label="购票影院" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [

                    ]
                  })(
                    <Select
                      mode="multiple"
                      size="default"
                      style={{ width: 180 }}
                      placeholder="Please select"
                    >
                      <Option value="">请选择</Option>
                      <Option value="0">即将开始</Option>
                      <Option value="1">进行中</Option>
                      <Option value="2">已结束</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="影片名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [

                    ]
                  })(
                    <Input maxLength="15" size="default" style={{ width: 180 }} placeholder="请输入手机号" />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem label="影片类型" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [

                    ]
                  })(
                    <Select
                      mode="multiple"
                      size="default"
                      style={{ width: 180 }}
                      placeholder="Please select"
                    >
                      <Option value="">请选择</Option>
                      <Option value="0">即将开始</Option>
                      <Option value="1">进行中</Option>
                      <Option value="2">已结束</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="购票渠道" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [

                    ]
                  })(
                    <Select
                      mode="multiple"
                      size="default"
                      style={{ width: 180 }}
                      placeholder="Please select"
                    >
                      <Option value="">请选择</Option>
                      <Option value="0">即将开始</Option>
                      <Option value="1">进行中</Option>
                      <Option value="2">已结束</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <Button type="primary" htmlType="submit" ghost>查询</Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Modal
          visible={visible}
          onOk={(stValue, id) => { this.addGroup(stValue, id) }}
          onCancel={this.close}
          groupInfoById={groupInfoById}
        >
        </Modal>
        <div className="table-container">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={content}
            onChange={this.handleTableChange}
            scroll={{ x: 1250 }}
            pagination={{
              ...pagination,
              total,
              current: pagination.page,
              size: 'small',
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: totalData => (<div>共<span className="page-text">{totalData}</span>条数据</div>),
            }}
          />
        </div>
      </Layout >
    );
  }
}

OrderList.propTypes = {};


function mapStateToProps({ memeberGroup }) {
  return {
    memeberGroup
  };
}

const WrappedOrderList = Form.create()(OrderList);

export default connect(mapStateToProps)(WrappedOrderList);
