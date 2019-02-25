import { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Layout, Button, Table, Card, Modal, Form, Row, Col, Input, message } from 'antd';
import UModal from './Modal';
import config from '../../../utils/config';
import style from '../index.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { formItemLayout } = config;

class TypesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      searchParams: {},
      pagination: {
        page: 1,
        pageSize: 10,
      },
      typesInfoById: {
        id: '',
        name: '',
        description: ''
      }
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'types/getClassifyList',
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
    dispatch({
      type: 'types/getClassifyList',
      payload: query,
    });
  }

  addTypes = (values, id) => {
    const { dispatch } = this.props;
    const { searchParams, pagination } = this.state;

    let url = 'types/addClassify';
    if (id) {
      url = 'types/updateClassify';
      values.id = id;
    }
    dispatch({
      type: url,
      payload: values,
      callback: (res) => {
        if (res && res.msg === 'SUCCESS') {
          message.success(`分类${id ? '更新' : '添加'}成功`);
          this.setState({
            visible: false
          })
          dispatch({
            type: 'types/getClassifyList',
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

  deleteTypes = (id) => {
    const { dispatch } = this.props;
    const { searchParams, pagination } = this.state;
    confirm({
      title: '删除',
      content: '确定删除分类吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'types/deleteClassify',
          payload: { id },
          callback: (res) => {
            if (res && res.msg === 'SUCCESS') {
              message.success("删除成功");
              dispatch({
                type: 'types/getClassifyList',
                payload: {
                  ...searchParams,
                  ...pagination
                }
              })
            }
          }
        })
      }
    });
  }

  editTypes = (id) => {
    const { dispatch } = this.props;
    if (id) {
      dispatch({
        type: 'types/getClassifyById',
        payload: { id },
        callback: (res) => {
          if (res && res.msg === 'SUCCESS') {
            this.setState({
              visible: true,
              typesInfoById: {
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
        typesInfoById: {
          id: '',
          name: '',
          description: ''
        }
      })
    }
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
        type: 'types/getClassifyList',
        payload,
      });
    });
  }

  render() {
    const { form: { getFieldDecorator }, types } = this.props;
    const { pagination, visible, typesInfoById } = this.state;
    const { getClassifyListData: { content, total } } = types;

    const columns = [{
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    }, {
      title: '分类描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      width: 300,
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
    }, {
      title: '最后修改人',
      dataIndex: 'updatorName',
      key: 'updatorName',
      align: 'center',
    }, {
      title: '最后修改时间',
      dataIndex: 'gmtModified',
      key: 'gmtModified',
      align: 'center',
    }, {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: '150px',
      render: record => (
        <>
          <Button size="small" type="primary" onClick={() => { this.editTypes(record.id) }}>编辑</Button>
          <Button size="small" onClick={() => { this.deleteTypes(record.id) }}>删除</Button>
        </>
      ),
    }];
    return (
      <Layout>
        <Card hoverable className="search-card">
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={8}>
                <FormItem label="分类名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: []
                  })(
                    <Input size="default" placeholder="请输入" />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="分类描述" {...formItemLayout}>
                  {getFieldDecorator('description', {
                    rules: []
                  })(
                    <Input size="default" placeholder="请输入" />,
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  <Button type="primary" htmlType="submit" ghost>搜索</Button>
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem className="text-right">
                  <Button type="primary" ghost onClick={() => { this.editTypes() }}>新增</Button>
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
        <UModal
          visible={visible}
          onOk={(stValue, id) => { this.addTypes(stValue, id) }}
          onCancel={this.close}
          typesInfoById={typesInfoById}
        >
        </UModal>
      </Layout >
    );
  }
}

TypesList.propTypes = {};


function mapStateToProps({ types, app }) {
  return {
    types,
    app,
  };
}

const WrappedTypesList = Form.create()(TypesList);

export default connect(mapStateToProps)(WrappedTypesList);
