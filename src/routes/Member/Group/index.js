import { Component } from 'react';
import { connect } from 'dva';
import { Layout, Button, Table, Card, Form, Row, Col, Input, Breadcrumb, message, Modal } from 'antd';
import UModal from './Modal';
import style from '../index.less';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class GroupList extends Component {
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
      type: 'memeberGroup/getMemberGroupList',
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
      type: 'memeberGroup/getMemberGroupList',
      payload: query,
    });
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
    confirm({
      title: '删除',
      content: '确定删除吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
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
                  page: pagination.page,
                  rows: pagination.pageSize,
                }
              })
            }
          }
        })
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
    const { form, memeberGroup,app } = this.props;
    const { pagination, visible, groupInfoById } = this.state;
    const { getMemberGroupListData: { content, total } } = memeberGroup;
    const { getFieldDecorator } = form;
    const { resource = "" } = this.props.app;

    const columns = [{
      title: '组别名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '组别描述',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '组内人数',
      dataIndex: 'memberNumber',
      key: 'memberNumber',
    }, {
      title: '创建人',
      dataIndex: 'creatorName',
      key: 'creatorName',
    }, {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
    }, {
      title: '最后修改人',
      dataIndex: 'updatorName',
      key: 'updatorName',
    }, {
      title: '最后修改时间',
      dataIndex: 'gmtModified',
      key: 'gmtModified'
    }, {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: '150px',
      render: record => (
        <div>
          {resource.indexOf("p36p") > 0 ?
          <Button size="small" type="danger" onClick={() => { this.editGroup(record.id) }}>编辑</Button>
          : ""}
          {resource.indexOf("p37p") > 0 ?
          <Button size="small" onClick={() => { this.deleteGroup(record.id) }}>删除</Button>
          : ""}
        </div>
      ),
    }];
    return (
      <Layout>
        <Breadcrumb separator=">>">
          <Breadcrumb.Item>用户管理</Breadcrumb.Item>
          <Breadcrumb.Item>用户组别</Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={6}>
                <FormItem label="组别名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: []
                  })(
                    <Input maxLength="15" size="default" style={{ width: 180 }} placeholder="请输入" />,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="组别描述" {...formItemLayout}>
                  {getFieldDecorator('description', {
                    rules: [

                    ]
                  })(
                    <Input maxLength="15" size="default" style={{ width: 180 }} placeholder="请输入" />,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>

                <Button type="primary" htmlType="submit" ghost>搜索</Button>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
              {resource.indexOf("p35p") > 0 ?
                <Button type="primary" ghost onClick={() => { this.editGroup() }}>新增</Button>
                : ""}
              </Col>
            </Row>
          </Form>
        </Card>
        <UModal
          visible={visible}
          onOk={(stValue, id) => { this.addGroup(stValue, id) }}
          onCancel={this.close}
          groupInfoById={groupInfoById}
        >
        </UModal>
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

GroupList.propTypes = {};


function mapStateToProps({ memeberGroup,app }) {
  return {
    memeberGroup,
    app,
  };
}

const WrappedGroupList = Form.create()(GroupList);

export default connect(mapStateToProps)(WrappedGroupList);
