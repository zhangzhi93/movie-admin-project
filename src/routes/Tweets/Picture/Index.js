import { Component } from 'react';
import { connect } from 'dva';
import { Layout, Button, Modal, Card, Select, Upload, Icon, Form, Row, Col, Input, message, Pagination } from 'antd';
import { Link } from 'dva/router';
import ImageCard from '../../../components/Public/ImageCard';
import config from '../../../utils/config';
import styles from '../index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class ImagesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      editVisible: false,
      id: '',
      pagination: {
        page: 1,
        pageSize: 10,
      },
      file: {},
      fileList: []
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'images/getImageList',
      payload: {
        page: 1,
        rows: 10
      },
      callback: (res) => {
        if (res && res.status !== 0) {
          message.error(res.msg);
        }
      }
    });
    dispatch({
      type: 'types/getClassifyOption'
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
      type: 'images/getImageList',
      payload: {
        page,
        rows: pageSize
      },
    });
  }

  imageUpload = ({ file, fileList }) => {
    if (file.status === 'done' && file.response.status !== 0) {
      message.error(file.response.msg);
    } else if (file.status === 'done' && file.response.status === 0) {
      this.setState({ file });
    }
    this.setState({ fileList: [...fileList] });
  }

  showUpload = () => {
    const { form: { setFieldsValue } } = this.props;
    this.setState({
      visible: true,
      fileList: []
    }, () => {
      setFieldsValue({
        name: '',
        classifyId: '',
      });
    })
  }

  saveImage = () => {
    const { form, dispatch } = this.props;
    const { file: { response: { data: { wechatUrl, ossUrl, mediaId } } } } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'images/addImage',
        payload: {
          classifyId: values.classifyId,
          imageUrl: ossUrl,
          wechatUrl,
          wechatMediaId: mediaId,
          name: values.name
        },
        callback: (res) => {
          if (res.msg == 'SUCCESS') {
            message.success("图片上传成功！");
            dispatch({
              type: 'images/getImageList',
              payload: {
                page: 1,
                rows: 10
              },
              callback: (res) => {
                if (res.msg == 'SUCCESS') {
                  this.setState({ visible: false });
                } else {
                  message.error(res.msg);
                }
              }
            });
          }
        }
      });
    });
  }

  editImage = (id) => {
    const { dispatch, form: { setFieldsValue } } = this.props;

    dispatch({
      type: 'images/getImageById',
      payload: { id },
      callback: res => {
        if (res.status === 0) {
          this.setState({
            id: id,
            editVisible: true,
          }, () => {
            setFieldsValue({
              name: res.data.name,
              classifyId: res.data.classifyId
            })
          });
        }
      }
    })
  }

  deleteImage = (id) => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    confirm({
      title: '删除',
      content: '确定删除图片吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'images/deleteImage',
          payload: { id },
          callback: (res) => {
            if (res.msg === 'SUCCESS') {
              message.success("删除成功");
              dispatch({
                type: 'images/getImageList',
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

  updateImage = () => {
    const { id } = this.state;
    const { dispatch, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'images/updateImage',
        payload: {
          ...values,
          id: id
        },
        callback: res => {
          if (res.status === 0) {
            message.success("图片修改成功");
            this.setState({
              editVisible: false
            })
          } else {
            message.error(res.msg)
          }
        }
      })
    });
  }

  render() {
    const { form: { getFieldDecorator }, images, types: { getClassifyOptionData },loading } = this.props;
    const isLoading = loading.effects['images/getImageList'];
    const { pagination, visible, editVisible, fileList } = this.state;
    const { getImageListData: { content, total }, getImageByIdData } = images;

    return (
      <Layout>
        <Card
          title="素材库-图片"
          loading={isLoading}
          extra={
            <>
              <Link to="/Tweets/TypesList" className="link-btn">
                <Button type="primary" ghost>分类管理</Button>
              </Link>
              <Button type="primary" ghost onClick={() => { this.showUpload() }}>上传</Button>
            </>
          }
        >
          <Row>
            {
              content.map(item => (
              <div key={item.id} className={styles.col_5}>
                <ImageCard
                  isEditable={true}
                  isDeletable={true}
                  record={item}
                  showAction={true}
                  ImageEdit={(id) => this.editImage(id)}
                  ImageDelete={(id) => this.deleteImage(id)} />
              </div>
              ))
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
        <Modal
          title="上传图片"
          visible={visible}
          onOk={this.saveImage}
          onCancel={() => {
            this.setState({ visible: false });
          }}
          width={620}
        >
          <Form>
            <Row>
              <Col span={24}>
                <FormItem label="选择分类" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                  {getFieldDecorator('classifyId', {
                    rules: [
                      { required: true, message: '不能为空' },
                    ],
                  })(
                    <Select
                      style={{ width: 180 }}
                      placeholder="请选择"
                    >
                      {
                        getClassifyOptionData.map(item => {
                          return (
                            <Option value={item.id + ''} key={item.id}>{item.name}</Option>
                          );
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
                <FormItem label="上传图片" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                  <Upload
                    action={`${config.url}/oss/upload-wechat-image`}
                    fileList={fileList}
                    onChange={this.imageUpload}
                    headers={{
                      'CsrfToken': config.CsrfToken,
                    }}
                  >
                    <Button><Icon type="upload" />上传</Button>
                  </Upload>
                </FormItem>
                <FormItem label="图片名称" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                  {getFieldDecorator('name', {
                    initialValue: getImageByIdData.name || '',
                    rules: [
                      { required: true, message: '不能为空' },
                    ],
                  })(
                    <Input maxLength="15" style={{ width: 180 }} placeholder="请输入" />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          title="编辑图片"
          visible={editVisible}
          onOk={this.updateImage}
          onCancel={() => this.setState({ editVisible: false })}
          width={620}
        >
          <Form>
            <Row>
              <Col span={24}>
                <FormItem label="选择分类" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                  {getFieldDecorator('classifyId', {
                    initialValue: getImageByIdData.classifyId || '',
                    rules: [
                      { required: true, message: '不能为空' },
                    ],
                  })(
                    <Select
                      style={{ width: 180 }}
                      placeholder="请选择"
                    >
                      {
                        getClassifyOptionData.map(item => {
                          return (
                            <Option value={item.id + ''} key={item.id}>{item.name}</Option>
                          );
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
                <FormItem label="图片名称" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                  {getFieldDecorator('name', {
                    initialValue: getImageByIdData.name || '',
                    rules: [
                      { required: true, message: '不能为空' },
                    ],
                  })(
                    <Input maxLength="15" style={{ width: 180 }} placeholder="请输入" />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Layout >
    );
  }
}

ImagesList.propTypes = {};

function mapStateToProps({ images, types, loading }) {
  return {
    images,
    types,
    loading,
  };
}

const WrappedImagesList = Form.create()(ImagesList);

export default connect(mapStateToProps)(WrappedImagesList);
