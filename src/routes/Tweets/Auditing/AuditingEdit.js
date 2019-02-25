import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Card, Layout, Row, Col, Input, Button, Table, Modal, Breadcrumb, message } from 'antd';
import { Link } from 'dva/router';
import ImageCard from '../../../components/Public/ImageCard';
import ImageTextCard from '../../../components/Public/ImageTextCard';
import styles from '../index.less';


const FormItem = Form.Item;
const { TextArea } = Input;
const TweetTypes = ['图文', '图片'];
const SHTypes = ['待审核', '审核通过', '已驳回'];

const formItemLayout = {
  labelCol: {
    sm: { span: 4 },
  },
  wrapperCol: {
    sm: { span: 20 },
  },
};


class AuditingEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      Wvisible: false,
      Wsaved: false,
      previewId: '',
    };
  }

  componentDidMount() {
    const { params: { id }, dispatch } = this.props;
    if (id !== '0') {
      dispatch({
        type: 'auditing/getTweetAuditRecordById',
        payload: { id },
      });
    }
  }

  // 微信预览
  pushWechat = () => {
    const { dispatch, auditing: { getTweetAuditRecordByIdData } } = this.props;
    dispatch({
      type: 'imagetext/savePreviewImageText',
      payload: {
        imageTextParamVOList: getTweetAuditRecordByIdData.imageTextItemList,
        name: getTweetAuditRecordByIdData.name,
        tweetType: 0,
      },
      callback: (res) => {
        if (res.status === 0) {
          this.setState({
            Wsaved: true,
            previewId: res.data.id,
          });
        } else {
          message.error(res.msg);
        }
      },
    });
  }

  previewWechat = () => {
    const { dispatch } = this.props;
    const { openId, previewId, Wsaved } = this.state;
    if (!Wsaved) {
      message.error('请先保存推文！');
      return;
    }
    message.loading('正在拼命加载中 ...', 0);
    dispatch({
      type: 'imagetext/PreviewWechatImageText',
      payload: {
        id: previewId,
        openId,
      },
      callback: (res) => {
        message.destroy();
        if (res.status === 0) {
          this.setState({
            Wsaved: false,
          });
          message.success('推送成功');
        }
      },
    });
  }

  submitSH = (auditStatus) => {
    const { dispatch, form: { validateFields }, params: { id }, history } = this.props;

    validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'auditing/auditTweet',
        payload: {
          id,
          auditParamVO: {
            ...values,
            auditStatus,
          },
        },
        callback: res => {
          if (res.status === 0) {
            this.setState({
              visible: false,
            });
            history.goBack(1);
          }
        },
      });
    });
  }

  //
  render() {
    const { form: { getFieldDecorator }, params: { id }, auditing: { getTweetAuditRecordByIdData } } = this.props;
    // console.log("getTweetAuditRecordByIdData: ", getTweetAuditRecordByIdData);
    const { visible, Wvisible, Wsaved } = this.state;
    const columns = [{
      title: '审核时间',
      dataIndex: 'auditTime',
      key: 'auditTime',
    }, {
      title: '审核结果',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      render: text => (<span>{SHTypes[text]}</span>)
    }, {
      title: '审核人',
      dataIndex: 'auditorName',
      key: 'auditorName',
    }, {
      title: '审核意见',
      dataIndex: 'auditContent',
      key: 'auditContent',
    }];

    return (
      <Layout>
        <Breadcrumb separator=">>">
          <Breadcrumb.Item>
            <Link to={'Tweets/Auditing'}>推文管理</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-active">审核记录</Breadcrumb.Item>
        </Breadcrumb>
        <Card
          title="审核记录"
          extra={
            <div>
              <Button size="large" ghost onClick={() => this.props.history.goBack()}>取消</Button>
              <Button size="large" type="primary" ghost onClick={() => this.setState({ visible: true })}>审核</Button>
            </div>
          }
        >
          <Form>
            <FormItem {...formItemLayout} label="推文编号">
              <span>{getTweetAuditRecordByIdData.id}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="推文名称">
              <span>{getTweetAuditRecordByIdData.name}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="推文类型">
              <span>{TweetTypes[getTweetAuditRecordByIdData.tweetType]}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="申请编号">
              <span>{getTweetAuditRecordByIdData.proposerId}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="申请时间">
              <span>{getTweetAuditRecordByIdData.proposerTime}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="申请人账号">
              <span>{getTweetAuditRecordByIdData.proposerName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="申请门店">
              <span>{getTweetAuditRecordByIdData.storeName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="推文详情">
              <Button style={{ marginLeft: 10 }} size="large" type="primary" ghost onClick={() => this.setState({ Wvisible: true })}>微信预览</Button>
              <Col span={8}>
                {getTweetAuditRecordByIdData.tweetType == 0 ?
                  <ImageTextCard record={getTweetAuditRecordByIdData} /> :
                  <ImageCard imageUrl={getTweetAuditRecordByIdData.tweetUrl ? getTweetAuditRecordByIdData.tweetUrl : '#'} />
                }
              </Col>
            </FormItem>
          </Form>
          <Table
            rowKey="id"
            columns={columns}
            size="small"
            dataSource={getTweetAuditRecordByIdData.auditRecordList}
            pagination={false}
            className={styles.shTable}
          />
        </Card>
        <Modal
          title="审核"
          visible={visible}
          onCancel={() => {
            this.setState({ visible: false });
          }}
          footer={
            <div>
              <Button onClick={() => { this.submitSH(1); }}>通过</Button>
              <Button type="primary" onClick={() => { this.submitSH(2); }}>驳回</Button>
            </div>
          }
        >
          {/* <Row>
            <Col span={12}>
              <span>审核人：{'xxx'}</span>
            </Col>
            <Col span={12}>
              <span>审核时间：{'xxx'}</span>
            </Col>
          </Row> */}
          <Form style={{ marginTop: 10 }}>
            <FormItem {...formItemLayout} label="审核意见">
              {getFieldDecorator('auditContent', {
                initialValue: '',
                rules: [
                  { required: true, message: '请输入审核意见' },
                ],
              })(
                <TextArea style={{ width: 260, height: 100 }} placeholder="请输入审核意见" />,
              )}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="微信预览"
          centered
          maskClosable={false}
          visible={Wvisible}
          footer={
            <div>
              <Button onClick={this.pushWechat}>保存</Button>
              <Button type="primary" onClick={this.previewWechat}>预览</Button>
            </div>
          }
          onCancel={() => this.setState({ Wvisible: false, required: false })}
          style={{ textAlign: 'center' }}
        >
          <Form>
            {
              Wsaved ?
                <FormItem {...formItemLayout} label="openId">
                  <Input style={{ width: 150 }} placeholder="请输入openId" onChange={(e) => this.setState({ openId: e.target.value })} />
                </FormItem> :
                <p>请先点击保存！</p>
            }
          </Form>
        </Modal>
      </Layout >
    );
  }
}

AuditingEdit.propTypes = {};


function mapStateToProps({ auditing }) {
  return {
    auditing,
  };
}

const WrappedAuditingEdit = Form.create()(AuditingEdit);

export default connect(mapStateToProps)(WrappedAuditingEdit);
