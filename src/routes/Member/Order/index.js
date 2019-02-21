import { Component } from 'react';
import { connect } from 'dva';
import { Layout, Button, Table, Card, Form, Row, Col, Input, DatePicker, Select, Breadcrumb, message } from 'antd';
import config from '../../../utils/config';
import qs from 'qs';
import style from '../index.less';

const FormItem = Form.Item;
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
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'memeberOrder/getMemberOrderList',
      payload: {
        page: 1,
        rows: 10
      }
    })
    dispatch({
      type: 'store/getStoreOption',
    });
    dispatch({
      type: 'memeberOrder/getMemberOrderPlatform',
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
      type: 'memeberOrder/getMemberOrderList',
      payload: query,
    });
  }

  doExportExcel = () => {
    const { searchParams } = this.state;
    window.open(`${config.url}/member/order/export?${qs.stringify(searchParams)}`);
  };


  handleSubmit = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { pagination } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (values.orderTime) {
        if (0 in values.orderTime) {
          values.orderTimeStart = values.orderTime[0].format('YYYY-MM-DD HH:mm:ss');
          values.orderTimeEnd = values.orderTime[1].format('YYYY-MM-DD HH:mm:ss');
          delete values.orderTime;
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
        type: 'memeberOrder/getMemberOrderList',
        payload,
      });
    });
  }

  render() {
    const { form, memeberOrder, store: { getStoreOptionData }, } = this.props;
    const { pagination } = this.state;
    const { getMemberOrderListData: { content, total }, getMemberOrderPlatformData } = memeberOrder;
    const { getFieldDecorator } = form;
    const { resource = "" } = this.props.app;

    const columns = [{
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '手机',
      dataIndex: 'mobileNo',
      key: 'mobileNo',
    }, {
      title: '购票时间',
      dataIndex: 'orderTime',
      key: 'orderTime',
    }, {
      title: '购票影院',
      dataIndex: 'orderStoreName',
      key: 'orderStoreName',
    }, {
      title: '购票渠道',
      dataIndex: 'orderPlatform',
      key: 'orderPlatform',
    }, {
      title: '购票金额',
      dataIndex: 'filmAmount',
      key: 'filmAmount',
    }, {
      title: '购票张数',
      dataIndex: 'orderNumber',
      key: 'orderNumber'
    }, {
      title: '影片名称',
      dataIndex: 'filmName',
      key: 'filmName'
    }, {
      title: '影片类型',
      dataIndex: 'filmType',
      key: 'filmType'
    }, {
      title: '影片时长',
      dataIndex: 'filmDuration',
      key: 'filmDuration'
    }, {
      title: '放映时间',
      dataIndex: 'projectionTime',
      key: 'projectionTime',
      render: (text, record) => (<span>{record.projectionStartTime}-{record.projectionEndTime}</span>)
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
                  {getFieldDecorator('mobileNo', {
                  })(
                    <Input maxLength="15" size="default" style={{ width: 180 }} placeholder="请输入手机号" />,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="购票时间" {...formItemLayout}>
                  {getFieldDecorator('orderTime')(
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
                  {getFieldDecorator('orderStoreId', {})(
                    <Select
                      size="default"
                      style={{ width: 180 }}
                      placeholder="请选择"
                      getPopupContainer={trigger => trigger.parentNode}
                    >
                      <Option value="">请选择</Option>
                      {
                        getStoreOptionData.map(item => {
                          return (
                            <Option value={item.id}>{item.name}</Option>
                          );
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="影片名称" {...formItemLayout}>
                  {getFieldDecorator('filmName', {
                  })(
                    <Input maxLength="15" size="default" style={{ width: 180 }} placeholder="请输入影片名称" />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem label="影片类型" {...formItemLayout}>
                  {getFieldDecorator('filmType', {
                  })(
                    <Select
                      size="default"
                      style={{ width: 180 }}
                      placeholder="请选择"
                      allowClear
                    >
                      <Option value="爱情片">爱情片</Option>
                      <Option value="剧情片">剧情片</Option>
                      <Option value="喜剧片">喜剧片</Option>
                      <Option value="家庭片">家庭片</Option>
                      <Option value="伦理片">伦理片</Option>
                      <Option value="文艺片">文艺片</Option>
                      <Option value="音乐片">音乐片</Option>
                      <Option value="歌舞片">歌舞片</Option>
                      <Option value="动漫片">动漫片</Option>
                      <Option value="西部片">西部片</Option>
                      <Option value="武侠片">武侠片</Option>
                      <Option value="古装片">古装片</Option>
                      <Option value="动作片">动作片</Option>
                      <Option value="恐怖片">恐怖片</Option>
                      <Option value="惊悚片">惊悚片</Option>
                      <Option value="冒险片">冒险片</Option>
                      <Option value="犯罪片">犯罪片</Option>
                      <Option value="悬疑片">悬疑片</Option>
                      <Option value="记录片">记录片</Option>
                      <Option value="战争片">战争片</Option>
                      <Option value="历史片">历史片</Option>
                      <Option value="传记片">传记片</Option>
                      <Option value="体育片">体育片</Option>
                      <Option value="科幻片">科幻片</Option>
                      <Option value="魔幻片">魔幻片</Option>
                      <Option value="奇幻片">奇幻片</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="购票渠道" {...formItemLayout}>
                  {getFieldDecorator('orderPlatform', {
                  })(
                    <Select
                      size="default"
                      style={{ width: 180 }}
                      placeholder="请选择"
                      allowClear
                    >
                      {
                        getMemberOrderPlatformData.map(item => (
                          <Option value={item.orderPlatform}>{item.orderPlatform}</Option>
                        ))
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <Button type="primary" htmlType="submit" ghost>查询</Button>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
              {resource.indexOf("p33p") > 0 ?
                <Button type="primary" ghost onClick={this.doExportExcel}>导出</Button>
                : ""}
              </Col>
            </Row>
          </Form>
        </Card>
        <div className="table-container">
          <Table
            rowKey="orderTime"
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


function mapStateToProps({ memeberOrder, store, app }) {
  return {
    memeberOrder,
    store,
    app,
  };
}

const WrappedOrderList = Form.create()(OrderList);

export default connect(mapStateToProps)(WrappedOrderList);
