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

class TweetsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
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


  deleteTweets = (id) => {
    const { dispatch } = this.props;
    const { searchParams, pagination } = this.state;
    dispatch({
      type: 'auditing/deleteTweetsById',
      payload: { id },
      callback: (res) => {
        if (res && res.msg === 'SUCCESS') {
          message.success("删除成功");
          dispatch({
            type: 'auditing/getTweetAuditingNotRichList',
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
          values.proposerBeginTime = proposerTime[0].format('YYYY-MM-DD');
          values.proposerEndTime = proposerTime[1].format('YYYY-MM-DD');
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
    const { form: { getFieldDecorator }, auditing, store: { getStoreOptionData }, app: { resource }, loading } = this.props;
    const { pagination } = this.state;
    const { getTweetAuditingNotRichListData: { content, total } } = auditing;
    const isLoading = loading.effects['auditing/getTweetAuditingNotRichList'];
    const columns = [{
      title: '编号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '消息类型',
      dataIndex: 'tweetType',
      key: 'tweetType',
      render: text => (<span>{TweetTypes[text]}</span>)
    }, {
      title: '消息标题',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '申请人',
      dataIndex: 'proposerName',
      key: 'proposerName',
    }, {
      title: '审核状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      render: text => (<span>{text == '-1' ? '草稿编辑中' : text == '0' ? '待审核' : text == '1' ? '审核通过' : text == '2' ? '已驳回' : '未知状态'}</span>)
    }, {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate'
    }, {
      title: '最后修改时间',
      dataIndex: 'gmtModified',
      key: 'gmtModified'
    }, {
      title: '审核通过时间',
      dataIndex: 'auditTime',
      key: 'auditTime'
    }, {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: '150px',
      render: record => (
        <div>
          {
            record.auditStatus != 2 ?
              <Link to={`Tweets/TweetsList/info/${record.id}`}>
                <Button size="small">查看</Button>
              </Link> : null
          }
          {
            record.auditStatus == 2  || record.auditStatus == -1 ?
              <Link to={`Tweets/TweetsList/edit/${record.id}`}>
                {resource.indexOf("p58p") > 0 ?
                  <Button size="small" type="danger">编辑</Button>
                  : ""}
              </Link> : null
          }
          {
            (record.auditStatus == 2  || record.auditStatus == -1) && resource.indexOf("p59p") > 0 ?
              <Button size="small" onClick={() => this.deleteTweets(record.id)}>删除</Button> : null
          }
        </div>
      ),
    }];

    return (
      <Layout>
        <Breadcrumb separator=">>">
          <Breadcrumb.Item>推文管理</Breadcrumb.Item>
          <Breadcrumb.Item>推文列表</Breadcrumb.Item>
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
                    <Select style={{ width: 180 }} size="default" allowClear placeholder="请选择门店" getPopupContainer={trigger => trigger.parentNode}>
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
                      <Option value={''}>请选择</Option>
                      <Option value={'-1'} key={-1}>草稿编辑中</Option>
                      <Option value={'0'} key={0}>待审核</Option>
                      <Option value={'1'} key={1}>审核通过</Option>
                      <Option value={'2'} key={2}>已驳回</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <Button type="primary" htmlType="submit" ghost>搜索</Button>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <Link to={`Tweets/TweetsList/edit/0`}>
                  {resource.indexOf("p57p") > 0 ?
                    <Button type="primary" ghost>新增</Button>
                    : ""}
                </Link>

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

TweetsList.propTypes = {};


function mapStateToProps({ auditing, store, app, loading }) {
  return {
    loading,
    auditing,
    store,
    app
  };
}

const WrappedTweetsList = Form.create()(TweetsList);

export default connect(mapStateToProps)(WrappedTweetsList);
