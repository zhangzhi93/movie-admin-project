import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout, Button, Card, Form, Row, Modal, Pagination, message } from 'antd';
import { Link } from 'dva/router';
import ImageTextCard from '../../../components/Public/ImageTextCard';
import styles from '../index.less';

const confirm = Modal.confirm;

class ImageTextList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      pagination: {
        page: 1,
        pageSize: 10,
      },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'imagetext/getImageTextNotRichList',
      payload: {
        page: 1,
        rows: 10
      },
      callback: (res) => {
        if (res && res.status !== 0) {
          message.error(res.msg);
        }
      }
    })
  }

  paginationChange = (page, pageSize) => {
    const { dispatch } = this.props;
    this.setState({
      pagination: {
        page,
        pageSize,
      },
    });
    dispatch({
      type: 'imagetext/getImageTextNotRichList',
      payload: {
        page,
        rows: pageSize
      },
    });
  }

  deleteImageText = (id) => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    confirm({
      title: '删除',
      content: '确定删除图文吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'imagetext/deleteImageText',
          payload: { id },
          callback: (res) => {
            if (res && res.status === 0) {
              message.success("删除成功");
              dispatch({
                type: 'imagetext/getImageTextNotRichList',
                payload: {
                  page: pagination.page,
                  rows: pagination.pageSize
                }
              })
            }
          }
        })
      }
    });
  }

  render() {
    const { imagetext,loading } = this.props;
    const isLoading = loading.effects['imagetext/getImageTextNotRichList'];
    const { pagination } = this.state;
    const { getImageTextNotRichListData: { content, total } } = imagetext;

    return (
      <Layout>
        <Card
          title="素材库-图文"
          loading={isLoading}
          extra={
            <>
              <Link to="/Tweets/TypesList" className="link-btn">
                <Button type="primary" ghost>分类管理</Button>
              </Link>
              <Link to="/Tweets/ImageText/edit/0" className="link-btn">
                <Button type="primary" ghost>新增</Button>
              </Link>
            </>
          }
        >
          <Row>
            {
              content.map(item => {
                return (
                  <div className={styles.col_5}>
                    <ImageTextCard
                      isCloneable={true}
                      isEditable={true}
                      isDeletable={true}
                      showAction={true}
                      record={item}
                      ImageTextDelete={(id) => this.deleteImageText(id)} />
                  </div>
                )
              })
            }
          </Row>
          <Pagination
            total={total}
            current={pagination.page}
            size="small"
            pageSize={pagination.pageSize}
            onChange={this.paginationChange}
            showTotal={totalData => (<div>共<span className="page-text">{totalData}</span>条数据</div>)}
          />
        </Card>
      </Layout >
    );
  }
}

ImageTextList.propTypes = {};


function mapStateToProps({ imagetext,loading }) {
  return {
    imagetext,
    loading
  };
}

const WrappedImageTextList = Form.create()(ImageTextList);

export default connect(mapStateToProps)(WrappedImageTextList);
