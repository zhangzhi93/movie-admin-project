import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Button, Table, Card, Form, Row, Col, Input, DatePicker, Select, message, Upload } from 'antd';
import { Link, routerRedux } from 'dva/router';
import config from '../../utils/config';
import styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class StoreList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      searchParams: {
        usable: '1',
      },
      pagination: {
        page: 1,
        pageSize: 20,
      },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/getStoreCitys'
    });
    dispatch({
      type: 'storeManage/getStoreList',
      payload: {
        page: 1,
        rows: 20
      }
    })
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
      type: 'storeManage/getStoreList',
      payload,
    });
  }

  downloadMB = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storeManage/downloadTemplet',
      callback: res => {
        if (res.msg === 'SUCCESS') {
          message.success('下载模板成功');
          window.open(res.data);
        } else {
          message.error(res.msg)
        }
      }
    });
  }

  uploadFile = ({ file }) => {
    if (file.status === 'done') {
      message.success('上传成功，请稍后手动搜索结果...');
    } else if (file.status === 'error') {
      message.error(`${file.name} 上传失败.`);
    }
  }

  //查询
  handleSubmit = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { pagination } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (values.gmtCreate) {
        let gmtCreateTime = values.gmtCreate
        if (0 in values.gmtCreate) {
          values.gmtCreateStart = gmtCreateTime[0].format('YYYY-MM-DD') + ' 00:00:00';
          values.gmtCreateEnd = gmtCreateTime[1].format('YYYY-MM-DD') + ' 23:59:59';
          delete values.gmtCreate;
        }
      }
      if (values.gmtModified) {
        let gmtModifiedTime = values.gmtModified
        if (0 in values.gmtModified) {
          values.gmtModifiedStart = gmtModifiedTime[0].format('YYYY-MM-DD') + ' 00:00:00';
          values.gmtModifiedEnd = gmtModifiedTime[1].format('YYYY-MM-DD') + ' 23:59:59';
          delete values.gmtModified;
        }
      }
      this.setState({
        searchParams: values,
        pagination: {
          ...pagination,
          page: 1,
        }
      });
      const payload = {
        ...values,
        page: 1,
        rows: pagination.pageSize,
      };
      dispatch({
        type: 'storeManage/getStoreList',
        payload,
      });
    });
  }

  manageStore = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storeManage/getStoreManageById',
      payload: {
        id
      },
      callback: res => {
        localStorage.setItem(`userType`, res.userType);
        localStorage.setItem(`storeId`, id);
        dispatch(routerRedux.push('/Index'));
      }
    })
  }

  downloadCode = (id) => {
    window.open(`${config.url}/store/store/${id}/qrcode`);
  }

  editStore = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storeManage/getStoreManageById',
      payload: {
        id
      },
      callback: res => {
        localStorage.setItem(`userType`, res.userType);
        localStorage.setItem(`storeId`, id);
        dispatch(routerRedux.replace(`/StoreManage/edit/${id}`));
      }
    })
  }

  render() {
    const { form, storeManage, app: { storeCountys } } = this.props;
    const { pagination } = this.state;
    const { getStoreListData: { content, total } } = storeManage;
    const { getFieldDecorator } = form;
    const { resource = "" } = this.props.app;
    const columns = [{
      title: '门店编号',
      dataIndex: 'id',
      sorter: (a, b) => parseInt(a.id) - parseInt(b.id),
      key: 'id',
      align: 'center',
      width: 150,
    }, {
      title: '门店名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    }, {
      title: '城市',
      dataIndex: 'cityName',
      key: 'cityName',
      align: 'center',
      width: 100,
    }, {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
      width: 250,
    }, {
      title: '创建人',
      dataIndex: 'creatorName',
      key: 'creatorName',
      align: 'center',
    }, {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      align: 'center',
      width: 200,
    }, {
      title: '最后修改时间',
      dataIndex: 'gmtModified',
      key: 'gmtModified',
      align: 'center',
      width: 200,
    }, {
      title: '最后修改人',
      dataIndex: 'updatorName',
      key: 'updatorName',
      align: 'center',
    }, {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 260,
      render: record => (
        <div>
          <Button type="danger" size="small" onClick={() => this.manageStore(record.id)}>管理</Button>
          <Button type="danger" size="small" onClick={() => this.editStore(record.id)}>编辑</Button>
          <Button size="small" onClick={() => this.downloadCode(record.id)}>下载二维码</Button>
        </div>
      ),
    }];
    return (
      <Layout>
        <Card hoverable className="search-card">
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={8}>
                <FormItem label="门店名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [
                      { max: 15, message: '门店长度不能大于15个字符' },
                    ]
                  })(
                    <Input maxLength="15" size="default" placeholder="请输入" />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="所在城市" {...formItemLayout}>
                  {getFieldDecorator('cityId', {
                    initialValue: '',
                  })(
                    <Select size="default" getPopupContainer={trigger => trigger.parentNode}>
                      <Option value="">请选择</Option>
                      {
                        (storeCountys || []).map((o) => {
                          return (
                            <Option key={o.name} value={o.id + ''}>{o.name}</Option>
                          );
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Button type="primary" htmlType="submit" ghost>搜索</Button>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem label="创建时间" {...formItemLayout}>
                  {getFieldDecorator('gmtCreate')(
                    <RangePicker
                      format="YYYY-MM-DD"
                      size="default"
                      getCalendarContainer={trigger => trigger.parentNode}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="最后修改时间" {...formItemLayout}>
                  {getFieldDecorator('gmtModified')(
                    <RangePicker
                      format="YYYY-MM-DD"
                      size="default"
                      getCalendarContainer={trigger => trigger.parentNode}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem className="text-right">
                  <Button type="primary" ghost>
                    <Link to={'/StoreManage/edit/0'}>新增</Link>
                  </Button>
                  <Upload
                    name='file'
                    action={`${config.url}/store/store/import`}
                    headers={{
                      'CsrfToken': config.CsrfToken,
                    }}
                    withCredentials={true}
                    showUploadList={false}
                    onChange={this.uploadFile}
                  >
                    <Button type="primary" ghost>上传</Button>
                  </Upload>
                  <Button type="primary" ghost onClick={this.downloadMB}>下载模板</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <div className="table-container">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={content}
            onChange={this.handleTableChange}
            scroll={{ x: 1920 }}
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

StoreList.propTypes = {};


function mapStateToProps({ storeManage, app }) {
  return {
    storeManage,
    app
  };
}

const WrappedStoreList = Form.create()(StoreList);

export default connect(mapStateToProps)(WrappedStoreList);
