import { Component } from 'react';
import { connect } from 'dva';
import { Layout, Button, Table, Card, Form, Row, Col, Input, Breadcrumb, message, Modal } from 'antd';
import { Link } from 'dva/router';
import style from '../index.less';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class TagList extends Component {
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
      type: 'memeberTag/getMemberTagList',
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
      type: 'memeberTag/getMemberTagList',
      payload: query,
    });
  }


  deleteTag = (id) => {
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
          type: 'memeberTag/deleteMemberTag',
          payload: { id },
          callback: (res) => {
            if (res && res.msg === 'SUCCESS') {
              message.success("删除成功");
              dispatch({
                type: 'memeberTag/getMemberTagList',
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
        type: 'memeberTag/getMemberTagList',
        payload,
      });
    });
  }

  render() {
    const { form, memeberTag, app } = this.props;
    const { pagination } = this.state;
    const { getMemberTagListData: { content, total } } = memeberTag;
    const { getFieldDecorator } = form;
    const { resource = "" } = this.props.app;

    const columns = [{
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '标签描述',
      dataIndex: 'description',
      key: 'description',
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
          <Link to={`/Member/TagList/edit/${record.id}`}>
            {resource.indexOf("p40p") > 0 ?
              <Button size="small" type="danger">编辑</Button>
              : ""}
          </Link>
          {resource.indexOf("p41p") > 0 ?
            <Button size="small" onClick={() => { this.deleteTag(record.id) }}>删除</Button>
            : ""}
        </div>
      ),
    }];
    return (
      <Layout>
        <Breadcrumb separator=">>">
          <Breadcrumb.Item>用户管理</Breadcrumb.Item>
          <Breadcrumb.Item>用户标签</Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={6}>
                <FormItem label="标签名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: []
                  })(
                    <Input maxLength="15" size="default" style={{ width: 180 }} placeholder="请输入" />,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="标签描述" {...formItemLayout}>
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
                <Link to={`/Member/TagList/edit/${0}`}>
                  <Button type="primary" ghost>新增</Button>
                </Link>
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
      </Layout >
    );
  }
}

TagList.propTypes = {};


function mapStateToProps({ memeberTag, app }) {
  return {
    memeberTag,
    app,
  };
}

const WrappedTagList = Form.create()(TagList);

export default connect(mapStateToProps)(WrappedTagList);
