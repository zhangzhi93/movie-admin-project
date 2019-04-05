import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Button, Table, Card, Form, Row, Col, Input, DatePicker, Select, Modal, Spin, message } from 'antd';
import debounce from 'lodash/debounce';
import config from '../../../utils/config';
import qs from 'qs';
import { Link } from 'dva/router';
import style from '../index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const { formItemLayout } = config;

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modalTitle: '',
      addType: '',
      fetching: false,
      searchParams: {},
      pagination: {
        page: 1,
        pageSize: 10,
      },
      selectedRowKeys: []
    };
    this.getTag = debounce(this.getTag, 200);
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'storeManage/getStoreOption',
    });
    dispatch({
      type: 'memeberTag/getMemberTagOption',
    });
    dispatch({
      type: 'memeberGroup/getMemberGroupOption'
    })
    dispatch({
      type: 'memberUser/getUserList',
      payload: {
        page: 1,
        rows: 10
      }
    })
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  handleTableChange = (pagination) => {
    const { pageSize, current } = pagination;
    const { dispatch } = this.props;
    const { searchParams } = this.state;
    this.setState({
      pagination: {
        page: current,
        pageSize,
      },
    });
    const payload = {
      ...searchParams,
      page: current,
      rows: pageSize,
    };
    dispatch({
      type: 'memberUser/getUserList',
      payload: payload,
    });
  }

  getTag = (value) => {
    const { dispatch } = this.props;
    this.setState({
      fetching: true
    })
    dispatch({
      type: 'memeberTag/getMemberTagOption',
      payload: {
        name: value
      },
      callback: (res) => {
        if (res.status === 0) {
          this.setState({ fetching: false })
        }
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { pagination } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (values.register) {
        let registerTime = values.register
        if (0 in values.register) {
          values.registerTimeStart = registerTime[0].format('YYYY-MM-DD HH:mm:ss');
          values.registerTimeEnd = registerTime[1].format('YYYY-MM-DD HH:mm:ss');
          delete values.register;
        }
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
        type: 'memberUser/getUserList',
        payload,
      });
    });
  }

  freezeOrRecover = (record) => {
    const { searchParams, pagination } = this.state;
    const { dispatch } = this.props;
    let requestUrl = 'memberUser/freezeById';
    if (record.memberStatus != 0) {
      requestUrl = 'memberUser/recoverById';
    }

    dispatch({
      type: requestUrl,
      payload: { id: record.id },
      callback: (data) => {
        this.setState({ visible: false });
        if (data && data.msg === 'SUCCESS') {
          message.success(`用户${record.memberStatus == 0 ? '冻结' : '恢复'}成功`);
          dispatch({
            type: 'memberUser/getUserList',
            payload: {
              ...searchParams,
              ...pagination
            }
          });
        } else {
          message.error(data.msg || '操作用户失败');
        }
      },
    });
  }

  freezeBatch = () => {
    const { searchParams, pagination, selectedRowKeys } = this.state;
    const { dispatch } = this.props;
    if (selectedRowKeys.length === 0) {
      message.error("请选择您要冻结的行！")
    } else {
      dispatch({
        type: 'memberUser/freeze',
        payload: {
          memberIds: selectedRowKeys
        },
        callback: res => {
          if (res.msg === 'SUCCESS') {
            message.success('冻结成功');
            this.setState({
              selectedRowKeys: []
            })
            dispatch({
              type: 'memberUser/getUserList',
              payload: {
                ...searchParams,
                ...pagination
              }
            });
          }
        }
      })
    }
  }

  showAddBatch = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      message.error("请选择一行数据！")
    } else {
      this.setState({
        modalTitle: '加入分组 - 选择分组，已选' + selectedRowKeys.length + '个用户',
        visible: true,
        addType: 'showAddBatch',
      })
    }
  }

  showAddBatchAll = () => {
    const { memberUser: { getUserListData: { total } } } = this.props;
    const { selectedRowKeys } = this.state;
    if (total === 0) {
      message.error("至少要有一条用户数据！")
    } else if (selectedRowKeys.length === 0) {
      message.error("请选择一行数据！")
    } else {
      this.setState({
        modalTitle: '批量加入分组 - 选择分组，已选' + selectedRowKeys.length + '个用户',
        visible: true,
        addType: 'showAddBatchAll',
      })
    }
  }

  addgroupByIds = () => {
    const { searchParams, pagination, selectedRowKeys, addType } = this.state;
    const { dispatch, form: { validateFields } } = this.props;

    validateFields((err, values) => {
      if (err) {
        return;
      }

      let type = addType === 'showAddBatch' ? 'memberUser/updateUserBatch' : 'memberUser/updateUserBatchAll';
      let payload = addType === 'showAddBatch' ?
        { groupIds: values.memberGroupIdsModal, memberIds: selectedRowKeys } : { memberParamVO: searchParams, groupIds: values.memberGroupIdsModal };
      dispatch({
        type: type,
        payload: payload,
        callback: res => {
          if (res.status === 0) {
            message.success('加入成功');
            this.setState({
              selectedRowKeys: [],
              visible: false
            })
            dispatch({
              type: 'memberUser/getUserList',
              payload: {
                ...searchParams,
                ...pagination
              }
            });
          } else {
            message.error(res.msg);
          }
        }
      })
    });
  }

  doExportExcel = () => {
    const { searchParams } = this.state;
    window.open(`${config.url}/member/member/export?${qs.stringify(searchParams)}`);
  };

  render() {
    const { form: { getFieldDecorator }, storeManage: { getStoreOptionData }, memeberGroup: { getMemberGroupOptionData }, memeberTag: { getMemberTagOptionData }, memberUser: { getUserListData: { content, total } }, loading } = this.props;
    const { pagination, fetching, selectedRowKeys, visible, modalTitle } = this.state;
    const rowSelection = {
      fixed: true,
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const isLoading = loading.effects['memberUser/getUserList'];

    const columns = [{
      title: '用户ID',
      dataIndex: 'id',
      sorter: (a, b) => parseInt(a.id) - parseInt(b.id),
      key: 'id',
      align: 'center',
      width: 100,
    }, {
      title: '手机',
      dataIndex: 'mobileNo',
      key: 'mobileNo',
      align: 'center',
      width: 100,
    }, {
      title: '注册时间',
      dataIndex: 'registerTime',
      key: 'registerTime',
      align: 'center',
      width: 200,
    }, {
      title: '注册影院',
      dataIndex: 'registerStoreName',
      key: 'registerStoreName',
      align: 'center',
    }, {
      title: '关注影院',
      dataIndex: 'followStoreName',
      key: 'followStoreName',
      align: 'center',
    }, {
      title: '已购票影院',
      dataIndex: 'alreadyBuyStoresStr',
      key: 'alreadyBuyStoresStr',
      align: 'center',
    }, {
      title: '微信openid',
      dataIndex: 'openId',
      key: 'openId',
      align: 'center',
      width: 250,
    }, {
      title: '是否关注',
      dataIndex: 'followStatus',
      key: 'followStatus',
      align: 'center',
      render: (text, record) => (<span>{text === 1 ? '已关注' : '未关注'}</span>)
    }, {
      title: '关注时间',
      dataIndex: 'followTime',
      key: 'followTime',
      align: 'center',
      width: 200,
    }, {
      title: '昵称',
      dataIndex: 'nickName',
      key: 'nickName',
      align: 'center',
    }, {
      title: '生日',
      dataIndex: 'birthday',
      key: 'birthday',
      align: 'center',
      width: 200,
      render: text => (<span>{(text || '').split(' ')[0]}</span>)
    }, {
      title: '用户标签',
      dataIndex: 'tagsStr',
      key: 'tagsStr',
      align: 'center',
    }, {
      title: '所属分组',
      dataIndex: 'memberGroupsStr',
      key: 'memberGroupsStr',
      align: 'center',
    }, {
      title: '最后修改',
      dataIndex: 'gmtModified',
      key: 'gmtModified',
      align: 'center',
      width: 200,
    }, {
      title: '状态',
      dataIndex: 'memberStatus',
      key: 'memberStatus',
      align: 'center',
      render: (text, record) => (<span>{text === 0 ? '正常' : '冻结'}</span>)
    }, {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: record => (
        <>
          <Link to={`/Member/UserList/info/${record.id}`}><Button size="small" type="primary">编辑</Button></Link>
          <Button size="small" onClick={() => this.freezeOrRecover(record)}>{record.memberStatus === 0 ? '冻结' : '恢复'}</Button>
        </>
      ),
    }];
    return (
      <Layout>
        <Card hoverable className="search-card">
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={8}>
                <FormItem label="注册影院" {...formItemLayout}>
                  {getFieldDecorator('registerStoreId', {})(
                    <Select placeholder="请选择"
                      getPopupContainer={trigger => trigger.parentNode}
                    >
                      <Option value="">请选择</Option>
                      {
                        getStoreOptionData.map(item => {
                          return (
                            <Option value={item.id + ''} key={item.id}>{item.name}</Option>
                          );
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="注册时间" {...formItemLayout}>
                  {getFieldDecorator('register')(
                    <RangePicker format="YYYY-MM-DD hh:mm:ss"
                      showTime
                      style={{ width: '100%' }}
                      getCalendarContainer={trigger => trigger.parentNode}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  <Button type="primary" ghost htmlType="submit">搜索</Button>
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem className="text-right">
                  <Button type="primary" ghost onClick={this.doExportExcel}>导出</Button>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="所属分组" {...formItemLayout}>
                  {getFieldDecorator('memberGroupIds', {})(
                    <Select mode="multiple"
                      placeholder="请选择"
                    >
                      {
                        getMemberGroupOptionData.map(item => {
                          return (
                            <Option value={item.id + ''} key={item.id}>{item.name}</Option>
                          );
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="关注影院" {...formItemLayout}>
                  {getFieldDecorator('followStoreId')(
                    <Select placeholder="请选择"
                      getPopupContainer={trigger => trigger.parentNode}
                    >
                      <Option value="">请选择</Option>
                      {
                        getStoreOptionData.map(item => {
                          return (
                            <Option value={item.id + ''} key={item.id}>{item.name}</Option>
                          );
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="手机号" {...formItemLayout}>
                  {getFieldDecorator('mobileNo', {
                    rules: [
                      { max: 15, message: '活动名称长度不能大于15个字符' },
                    ]
                  })(
                    <Input maxLength="15" placeholder="请输入" />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="用户标签" {...formItemLayout}>
                  {getFieldDecorator('tagIds')(
                    <Select mode="multiple"
                      onSearch={this.getTag}
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      placeholder="请选择"
                    >
                      {
                        getMemberTagOptionData.map(item => {
                          return (
                            <Option value={item.id + ''} key={item.id}>{item.name}</Option>
                          );
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem className="text-right">
                  <Button type="primary" ghost onClick={this.showAddBatch}>加入分组</Button>
                  <Button type="primary" ghost onClick={this.showAddBatchAll}>批量加入分组</Button>
                  <Button type="primary" ghost onClick={this.freezeBatch}>批量冻结</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <div className="table-container">
          <Table
            loading={isLoading}
            rowKey="id"
            columns={columns}
            dataSource={content}
            rowSelection={rowSelection}
            onChange={this.handleTableChange}
            scroll={{ x: 2250 }}
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
        <Modal
          title={modalTitle}
          visible={visible}
          onOk={this.addgroupByIds}
          onCancel={() => {
            this.setState({ visible: false });
          }}
          width={520}
        >
          <Form>
            <FormItem label="选择分组" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('memberGroupIdsModal', {
                initialValue: [],
                rules: [
                  // { required: true, message: '分组不能为空' },
                ]
              })(
                <Select
                  mode="multiple"
                  style={{ width: 260 }}
                  placeholder="请选择"
                >
                  {
                    getMemberGroupOptionData.map(item => {
                      return (
                        <Option value={item.id + ''} key={item.id}>{item.name}</Option>
                      );
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Form>
        </Modal>
      </Layout >
    );
  }
}

UserList.propTypes = {};


function mapStateToProps({ memberUser, memeberTag, memeberGroup, storeManage, app, loading }) {
  return {
    loading,
    memberUser,
    storeManage,
    memeberTag,
    memeberGroup,
    app,
  };
}

const WrappedUserList = Form.create()(UserList);

export default connect(mapStateToProps)(WrappedUserList);
