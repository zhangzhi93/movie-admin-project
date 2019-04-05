import { Component } from 'react';
import { connect } from 'dva';
import { Layout, Button, Table, Card, Select, DatePicker, Form, Row, Col, Input, Breadcrumb, message, Modal } from 'antd';
import { Link } from 'dva/router';
import style from '../index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const SHTypes = ['待审核', '审核通过', '已驳回'];
const TweetTypes = ['图文', '图片'];

class AuditingList extends Component {
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
      type: 'auditing/getTweetAuditingNotRichList',
      payload: {
        page: 1,
        rows: 10
      }
    })
    dispatch({
      type: 'store/getStoreOption'
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
    dispatch({
      type: 'auditing/getTweetAuditingNotRichList',
      payload: query,
    });
  }


  deleteArticle = (id) => {
    const { dispatch } = this.props;
    const { searchParams, pagination } = this.state;
    dispatch({
      type: 'article/deleteMaterialGroupSend',
      payload: { id },
      callback: (res) => {
        if (res && res.msg === 'SUCCESS') {
          message.success("删除成功");
          dispatch({
            type: 'article/getMaterialGroupSendList',
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
      if (values.proposerTime) {
        let proposerTime = values.proposerTime
        if (0 in values.proposerTime) {
          values.proposerBeginTime = proposerTime[0].format('YYYY-MM-DD') + ' 00:00:00';
          values.proposerEndTime = proposerTime[1].format('YYYY-MM-DD') + ' 23:59:59';
          delete values.proposerTime;
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
        type: 'auditing/getTweetAuditingNotRichList',
        payload,
      });
    });
  }

  render() {
    const { form: { getFieldDecorator }, auditing, store: { getStoreOptionData }, app, loading } = this.props;
    const { pagination } = this.state;
    const { getTweetAuditingNotRichListData: { content, total } } = auditing;
    const { resource = "" } = app;
    const isLoading = loading.effects['auditing/getTweetAuditingNotRichList'];

    const columns = [{
      title: '推文名称',
      dataIndex: 'name',
      key: 'name',
      width: '250px',
    }, {
      title: '推文编号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '推文类型',
      dataIndex: 'tweetType',
      key: 'tweetType',
      render: text => (<span>{TweetTypes[text]}</span>)
    }, {
      title: '申请门店',
      dataIndex: 'storeName',
      key: 'storeName',
    }, {
      title: '申请人',
      dataIndex: 'proposerName',
      key: 'proposerName',
    }, {
      title: '申请时间',
      dataIndex: 'proposerTime',
      key: 'proposerTime'
    }, {
      title: '审核状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      render: text => (<span>{text == '-1' ? '草稿编辑中' : text == '0' ? '待审核' : text == '1' ? '审核通过' : text == '2' ? '已驳回' : '未知状态'}</span>)
    }, {
      title: '审核人',
      dataIndex: 'auditorName',
      key: 'auditorName'
    }, {
      title: '审核时间',
      dataIndex: 'auditTime',
      key: 'auditTime'
    }, {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: '150px',
      render: record => (
        <div>
          <Link to={`Tweets/Auditing/info/${record.id}`}>
            <Button size="small">查看</Button>
          </Link>
          {
            record.auditStatus == 0 ?
              <Link to={`Tweets/Auditing/edit/${record.id}`}>
                {resource.indexOf("p55p") > 0 ?
                  <Button size="small" type="danger">审核</Button>
                  : ""}
              </Link> : null
          }
        </div>
      ),
    }];

    return (
      <Layout>
        <Breadcrumb separator=">>">
          <Breadcrumb.Item>推文管理</Breadcrumb.Item>
          <Breadcrumb.Item>审核列表</Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={6}>
                <FormItem label="推文名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [
                    ]
                  })(
                    <Input maxLength="15" size="default" style={{ width: 180 }} placeholder="请输入" />,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="申请门店" {...formItemLayout}>
                  {getFieldDecorator('storeId', {
                  })(
                    <Select style={{ width: 180 }} size="default" placeholder="请选择门店" getPopupContainer={trigger => trigger.parentNode}>
                      {
                        getStoreOptionData.map((o) => {
                          return (
                            <Option value={o.id + ''} key={o.id}>{o.name}</Option>
                          );
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem label="申请时间" {...formItemLayout}>
                  {getFieldDecorator('proposerTime')(
                    <RangePicker
                      style={{ width: 180 }}
                      format="YYYY-MM-DD"
                      size="default"
                      getCalendarContainer={trigger => trigger.parentNode}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="审核状态" {...formItemLayout}>
                  {getFieldDecorator('auditStatus')(
                    <Select style={{ width: 180 }} size="default" placeholder="请选择审核状态" getPopupContainer={trigger => trigger.parentNode}>
                      <Option value={'0'}>待审核</Option>
                      <Option value={'1'}>审核通过</Option>
                      <Option value={'2'}>已驳回</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <Button type="primary" htmlType="submit" ghost>搜索</Button>
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

AuditingList.propTypes = {};


function mapStateToProps({ auditing, store, app, loading }) {
  return {
    loading,
    auditing,
    store,
    app,
  };
}

const WrappedAuditingList = Form.create()(AuditingList);

export default connect(mapStateToProps)(WrappedAuditingList);
