import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Card, Select, Row, Col, Icon, Input, Button, Upload, Breadcrumb, Switch, message, Modal, Checkbox, Radio } from 'antd';
import QRCode from 'qrcode';
import config from '../../../utils/config';
import styles from '../index.less';
import { patternUrl } from '../../../utils/regex';


const RadioGroup = Radio.Group
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
  },
};

let current_editor = '';
const appkey = '5bd65977-c4f4-4a78-bd74-06e8ac10c65d'

class ImageTextEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      Wvisible: false,
      saved: false,
      Wsaved: false,
      pcVisible: false,//pc 本地预览
      pcPreviewContent: '',//pc 预览内容
      wechatMediaId: '',
      ossUrl: '',
      wechatUrl: '',
      isShowOutPage: false,
      ImageTextList: [],
      active: 0,
      loading: false,
      openId: '',
      previewId: '',
      firstArticleDetail: '',
      editorReady: false,
      author: '',
      externalUrl: '',
      savedisable: false,
      sendIgnoreReprint: '0',
    };
  }

  componentDidMount() {
    var that = this;
    const { params: { id }, dispatch, form: { setFieldsValue } } = that.props;

    message.destroy();

    that.initEditor();
    dispatch({
      type: 'types/getClassifyOption'
    });
    if (id !== '0') {
      message.loading('正在拼命加载中 ...', 0);
      dispatch({
        type: 'imagetext/getImageTextById',
        payload: { id },
        callback: (res) => {
          message.destroy();
          if (res.status === 0) {
            //
            that.setState({
              ImageTextList: res.data.imageTextItemList,
              ossUrl: res.data.imageTextItemList[0].coverUrl,
              wechatMediaId: res.data.imageTextItemList[0].wechatMediaId,
              wechatUrl: res.data.imageTextItemList[0].wechatUrl,
              isShowOutPage: res.data.imageTextItemList[0].contentType == 1 ? true : false,
              firstArticleDetail: res.data.imageTextItemList[0].articleDetail,
              author: res.data.imageTextItemList[0].author,
              externalUrl: res.data.imageTextItemList[0].externalUrl,
            }, () => {
              setFieldsValue({
                title: res.data.imageTextItemList[0].title,
                abstractStr: res.data.imageTextItemList[0].abstractStr,
                classifyId: res.data.imageTextItemList[0].classifyId,
                externalUrl: res.data.imageTextItemList[0].externalUrl,
                author: res.data.imageTextItemList[0].author,
                externalUrl: res.data.imageTextItemList[0].externalUrl,
              });
              if (that.state.editorReady) {
                current_editor.setContent(that.state.firstArticleDetail);
              };
            });

          }
        }
      })
    }
  }

  componentWillUnmount() {
    // 组件卸载后，清除放入库的id
    UE.delEditor('editor');
  }

  initEditor = () => {
    current_editor = UE.getEditor('editor', {
      initialFrameHeight: 650,
      style_url: 'https://www.135editor.com/editor_styles/open?inajax=1&v=page&appkey=' + appkey,
      style_width: 300,
      appkey: appkey,
      zIndex: 1000,
      plat_host: 'www.135editor.com',
      page_url: 'https://www.135editor.com/editor_styles/open_styles?inajax=1&appkey=' + appkey,
      pageLoad: true,
      open_editor: true,
      focus: true,
      focusInEnd: true
    });

    var that = this;
    //初始化编辑器赋值
    current_editor.addListener("ready", function () {
      that.setState({
        editorReady: true,
      });
      if (that.state.firstArticleDetail) {
        current_editor.setContent(that.state.firstArticleDetail);
      }
    });
  }

  handleChange = ({ file }) => {
    if (file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (file.status === 'done') {
      this.setState({
        loading: false,
        ossUrl: file.response.data.ossUrl,
        wechatMediaId: file.response.data.mediaId,
        wechatUrl: file.response.data.wechatUrl
      });
    }
  }

  //预览先保存
  saveItem = () => {
    const { dispatch, form: { validateFields } } = this.props;
    const { ImageTextList, active, ossUrl, wechatMediaId, wechatUrl, isShowOutPage, author, externalUrl } = this.state;
    let copyList = ImageTextList;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      copyList[active] = { ...copyList[active], ...values };
      copyList[active].coverUrl = ossUrl;
      copyList[active].wechatMediaId = wechatMediaId;
      copyList[active].wechatUrl = wechatUrl;
      copyList[active].contentType = isShowOutPage ? '1' : '0';
      copyList[active].author = author;
      copyList[active].externalUrl = externalUrl;
      //得到上个图文编辑器的值
      copyList[active].articleDetail = current_editor.getContent();
      //
      message.loading('正在拼命加载中 ...', 0);
      dispatch({
        type: 'imagetext/savePreviewImageText',
        payload: {
          imageTextParamVOList: copyList,
          name: copyList[0].title,
          tweetType: 0,
        },
        callback: (res) => {
          message.destroy();
          if (res.status === 0) {
            dispatch({
              type: 'imagetext/PreviewImageText',
              payload: {
                id: res.data.id
              },
              callback: (res1) => {
                if (res1.status === 0) {
                  this.setState({
                    saved: true
                  }, () => {
                    QRCode.toCanvas(this.refs.qrcode, res1.data.previewUrl, (error) => {
                      if (error) message.error(error)
                    })
                  })
                } else {
                  message.error(res1.msg);
                }
              }
            })
          } else {
            message.error(res.msg);
          }
        }
      })
    });
  }

  //微信预览
  pushWechat = () => {
    const { dispatch, form: { validateFields } } = this.props;
    const { ImageTextList, active, ossUrl, wechatMediaId, wechatUrl, isShowOutPage, author, externalUrl } = this.state;
    let copyList = ImageTextList;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      copyList[active] = { ...copyList[active], ...values };
      copyList[active].coverUrl = ossUrl;
      copyList[active].wechatMediaId = wechatMediaId;
      copyList[active].wechatUrl = wechatUrl;
      //copyList[active].contentType = isShowOutPage ? '1' : '0';
      copyList[active].contentType = '0';
      //copyList[active].author = author;
      //copyList[active].externalUrl = externalUrl;

      //得到上个图文编辑器的值
      copyList[active].articleDetail = current_editor.getContent();
      //
      message.loading('正在拼命加载中 ...', 0);
      dispatch({
        type: 'imagetext/savePreviewImageText',
        payload: {
          imageTextParamVOList: copyList,
          name: copyList[0].title,
          tweetType: 0,
        },
        callback: (res) => {
          message.destroy();
          if (res.status === 0) {
            this.setState({
              Wsaved: true,
              previewId: res.data.id
            })
          } else {
            message.error(res.msg);
          }
        }
      })
    })
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
        openId
      },
      callback: res => {
        message.destroy();
        if (res.status === 0) {
          this.setState({
            Wsaved: false,
          })
          message.success('推送成功');
        }
      }
    })
  }

  pcPreview = () => {
    const pcPreviewContent = current_editor.getContent();
    this.setState({
      pcVisible: true,
      pcPreviewContent: pcPreviewContent
    });
  }

  //删除条目
  deleteItem = (e, index) => {
    e.stopPropagation();
    const { form: { setFieldsValue } } = this.props;
    let { ImageTextList } = this.state;
    const length = ImageTextList.length;
    ImageTextList.splice(index, 1);
    index = (length - 1) == index ? index - 1 : index;
    //设置编辑器的值
    current_editor.setContent(ImageTextList[index].articleDetail);

    this.setState({
      ImageTextList,
      active: index,
      ossUrl: ImageTextList[index].coverUrl,
      wechatMediaId: ImageTextList[index].wechatMediaId,
      wechatUrl: ImageTextList[index].wechatUrl,
      //isShowOutPage: ImageTextList[index].contentType == '1' ? true : false,
      contentType: '0', // 正文类型：0文章详情，1外部链接
      author: ImageTextList[index].author,
      externalUrl: ImageTextList[index].externalUrl,
    }, () => {
      setFieldsValue({
        title: ImageTextList[index].title,
        abstractStr: ImageTextList[index].abstractStr,
        classifyId: ImageTextList[index].classifyId,
        author: ImageTextList[index].author,
        externalUrl: ImageTextList[index].externalUrl,
      })
    })
  }

  addImageText = () => {
    const { form: { validateFields, setFieldsValue } } = this.props;
    const { ImageTextList, active, ossUrl, wechatMediaId, wechatUrl, isShowOutPage, author, externalUrl } = this.state;
    let copyList = ImageTextList;
    if (ImageTextList.length >= 8) {
      message.error("最多添加八条");
    } else {
      validateFields((err, values) => {
        if (err) {
          return;
        }
        copyList[active] = values;
        copyList[active].coverUrl = ossUrl;
        copyList[active].wechatMediaId = wechatMediaId;
        copyList[active].wechatUrl = wechatUrl;
        //copyList[active].contentType = isShowOutPage ? '1' : '0';
        copyList[active].contentType = '0'; // 正文类型：0文章详情，1外部链接
        copyList[active].author = author;
        copyList[active].externalUrl = externalUrl;
        //得到上个图文编辑器的值
        copyList[active].articleDetail = current_editor.getContent();
        //清空编辑器
        current_editor.setContent('');
        //
        this.setState({
          ImageTextList: copyList,
          active: ImageTextList.length,
          ossUrl: '',
          loading: false,
          isShowOutPage: '',
          auth: '',
          externalUrl: '',
        }, () => {
          setFieldsValue({
            title: '',
            abstractStr: '',
            classifyId: '',
            author: '',
            externalUrl: ''
          })
        });
        copyList.push({});
      });
    }
  }

  editImageText = (index) => {
    const { form: { validateFields, setFieldsValue } } = this.props;
    const { ImageTextList, active, ossUrl, wechatMediaId, wechatUrl, isShowOutPage, author, externalUrl, sendIgnoreReprint } = this.state;
    let copyList = ImageTextList;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      copyList[active] = { ...copyList[active], ...values };
      copyList[active].coverUrl = ossUrl;
      //if (!copyList[active].wechatMediaId || copyList[active].wechatMediaId.length === 0) {
      copyList[active].wechatMediaId = wechatMediaId;
      //}
      copyList[active].wechatUrl = wechatUrl;
      //copyList[active].contentType = isShowOutPage ? '1' : '0';
      copyList[active].contentType = '0'; // 正文类型：0文章详情，1外部链接
      //copyList[active].author = author;
      //copyList[active].externalUrl = externalUrl;
      //保存上个正在编辑的图文编辑器的值
      copyList[active].articleDetail = current_editor.getContent();
      //要编辑的图文编辑器赋值
      current_editor.setContent(ImageTextList[index].articleDetail);

      //console.log('editImageText copyList: ', copyList);

      //
      this.setState({
        ImageTextList: copyList,
        active: index,
        ossUrl: ImageTextList[index].coverUrl,
        wechatMediaId: ImageTextList[index].wechatMediaId,
        wechatUrl: ImageTextList[index].wechatUrl,
        isShowOutPage: ImageTextList[index].contentType == '1' ? true : false,
        //author: ImageTextList[index].author,
        //externalUrl: ImageTextList[index].externalUrl,
      }, () => {
        setFieldsValue({
          title: ImageTextList[index].title,
          abstractStr: ImageTextList[index].abstractStr,
          classifyId: ImageTextList[index].classifyId,
          author: ImageTextList[index].author,
          externalUrl: ImageTextList[index].externalUrl,
        })
      })
    });
  }

  doSave = () => {
    const { dispatch, form: { validateFields }, history, params: { id }, location } = this.props;
    const { ImageTextList, active, ossUrl, wechatMediaId, wechatUrl, isShowOutPage, author, externalUrl } = this.state;
    let copyList = ImageTextList;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        savedisable: true
      });
      copyList[active] = { ...copyList[active], ...values };
      copyList[active].coverUrl = ossUrl;
      // if (!copyList[active].wechatMediaId || copyList[active].wechatMediaId.length === 0) {
      copyList[active].wechatMediaId = wechatMediaId;
      // }
      copyList[active].wechatUrl = wechatUrl;
      // copyList[active].contentType = isShowOutPage ? '1' : '0';
      copyList[active].contentType = '0'; // 正文类型：0文章详情，1外部链接
      // copyList[active].author = author;
      // copyList[active].externalUrl = externalUrl;

      // 保存上个正在编辑的图文编辑器的值
      copyList[active].articleDetail = current_editor.getContent();


      // console.log('doSave copyList: ', copyList);

      // 检查必要字段
      for (var i = 0; i < copyList.length; i++) {
        // 检查编辑器的内容是否有值
        if (copyList[i].articleDetail.length === 0) {
          message.info('图文正文不可为空，请检查！');
          this.setState({
            savedisable: false,
          });
          return;
        }

        //检查封面是否存在
        if (copyList[i].coverUrl.length === 0) {
          message.info('封面不可为空，请检查！');
          this.setState({
            savedisable: false,
          });
          return;
        }

        //检查微信图片地址是否存在
        if (copyList[i].wechatMediaId.length === 0 || copyList[i].wechatUrl.length === 0) {
          message.info('图片未上传微信，请重新添加封面图片！');
          this.setState({
            savedisable: false,
          });
          return;
        }
      }

      //
      if (id != 0 && location.query.copy != 1) {
        dispatch({
          type: 'imagetext/updateImageText',
          payload: {
            id,
            ImageTextList: copyList,
          },
          callback: (res) => {
            this.setState({
              savedisable: false,
            });
            if (res.status === 0) {
              message.success('编辑成功');
              history.goBack();
            } else {
              message.error(res.msg);
            }
          }
        })
      } else {
        dispatch({
          type: 'imagetext/addImageText',
          payload: copyList,
          callback: (res) => {
            this.setState({
              savedisable: false,
            });
            if (res.status === 0) {
              message.success('增加成功');
              history.goBack();
            } else {
              message.error(res.msg);
            }
          }
        })
      }
    });
  }

  onOriginalChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      sendIgnoreReprint: e.target.value,
    });
  }

  render() {
    const { form: { getFieldDecorator, getFieldValue }, params: { id }, types: { getClassifyOptionData } } = this.props;
    const { ossUrl, ImageTextList, active, loading, visible, saved, Wvisible, Wsaved, savedisable, pcVisible, pcPreviewContent, sendIgnoreReprint } = this.state;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };


    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className="template">
        <Breadcrumb separator=">>">
          <Breadcrumb.Item>推文管理</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-active">
            {id === '0' ? '新增图文' : '编辑图文'}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Card
          title={id === '0' ? '新增图文' : '编辑图文'}
          extra={
            <div>
              <Button size="large" ghost onClick={() => this.props.history.goBack()}>取消</Button>
              <Button size="large" type="primary" disabled={savedisable} ghost onClick={this.doSave}>提交</Button>
            </div>
          }
        >
          <Row gutter={15}>
            <Col span={4}>
              <Card className={styles.card}>
                <div className={styles.content}>
                  {
                    ImageTextList.map((item, index) => {
                      return (
                        <div key={item.id} className={`${styles.item} ${active == index ? styles.active : ''}`} onClick={() => this.editImageText(index)}>
                          {/* 删除一个图文 */}
                          {active == index ? <i className={styles.deleteBtn} onClick={(e) => this.deleteItem(e, active)}>x</i> : null}
                          {index == 0 ?
                            <div className={styles.poster} >
                              <img src={item.coverUrl} />
                              <strong>{item.title}</strong>
                            </div> :
                            <div className={styles.band}>
                              <p>{item.title}</p>
                              <img src={item.coverUrl} />
                            </div>
                          }
                        </div >
                      )
                    })
                  }
                  {/* 增加一个图文 */}
                  <div key='plus' className={`${styles.item} ${styles.dotted}`} onClick={this.addImageText}>
                    <Icon type="plus" />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={17}>
              <Form>
                <FormItem {...formItemLayout} label="标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题">
                  {getFieldDecorator('title', {
                    initialValue: '',
                    rules: [
                      { required: true, message: '请输入标题' },
                    ],
                  })(
                    <Input maxLength="64" style={{ width: 500 }} placeholder="请输入标题" />,
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="摘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;要">
                  {getFieldDecorator('abstractStr', {
                    initialValue: '',
                  })(
                    <TextArea style={{ width: 500 }} placeholder="请输入摘要" />,
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="作&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;者">
                  {getFieldDecorator('author', {
                    initialValue: '',
                  })(
                    <Input maxLength="8" style={{ width: 500 }} placeholder="请输入作者" />,
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="封&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;面">
                  <Upload
                    action={`${config.url}/oss/upload-wechat-image`}
                    listType="picture-card"
                    showUploadList={false}
                    onChange={this.handleChange}
                  >
                    {ossUrl && !loading ? <img src={ossUrl} alt="avatar" className={styles.img} /> : uploadButton}
                  </Upload>
                  {active == 0 ?
                    <p className="templateTip">请上传比例为 2.35 : 1 的图片</p> :
                    <p className="templateTip">请上传比例为 1 : 1 的图片</p>
                  }
                </FormItem>
                <FormItem {...formItemLayout} label="选择分组">
                  {getFieldDecorator('classifyId', {
                    initialValue: '',
                    rules: [
                      { required: true, message: '请选择分组' },
                    ],
                  })(
                    <Select
                      size="default"
                      style={{ width: 260 }}
                      placeholder="请选择分组"
                    >
                      <Option value='' key=''>请选择</Option>
                      {
                        getClassifyOptionData.map(item => {
                          return (
                            <Option value={item.id} key={item.id}>{item.name}</Option>
                          );
                        })
                      }
                    </Select>,
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="原文链接">
                  {getFieldDecorator('externalUrl', {
                    initialValue: '',
                    rules: [
                      { pattern: patternUrl, message: '地址必须以http://或https://开头' },
                    ],
                  })(
                    <Input maxLength="500" style={{ width: 500 }} placeholder="请输入链接地址" />,
                  )}
                </FormItem>
                <FormItem {...formItemLayout} required label="正&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;文">
                  <script id="editor" type="text/plain" style={{ width: '100%', height: 500 }}></script>
                </FormItem>
                <FormItem style={{ textAlign: 'center' }}>
                  <Button size="large" type="primary" ghost onClick={() => this.setState({ visible: true })}>手机预览</Button>
                  <Button size="large" type="primary" ghost onClick={() => this.setState({ Wvisible: true })}>微信预览</Button>
                  <Button size="large" type="primary" ghost onClick={this.pcPreview}>本地预览</Button>
                </FormItem>
              </Form>
            </Col>
          </Row>
        </Card>
        <Modal
          title="手机预览"
          centered
          maskClosable={false}
          visible={visible}
          onOk={this.saveItem}
          okText="保存"
          onCancel={() => this.setState({ visible: false, saved: false })}
          style={{ textAlign: 'center' }}
        >
          {
            saved ? <canvas ref="qrcode"></canvas> : <p>请先点击保存！</p>
          }

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
        <Modal
          title="本地预览"
          centered
          maskClosable={false}
          visible={pcVisible}
          width={360}
          footer={null}
          bodyStyle={{ overflowY: 'auto', height: '85vh' }}
          style={{ top: 20 }}
          onCancel={() => this.setState({ pcVisible: false })}
        >
          <div className={styles.container}>
            <h2>{getFieldValue('title')}</h2>
            <section className={styles.content} dangerouslySetInnerHTML={{ __html: pcPreviewContent }}></section>
          </div>
        </Modal>
      </div>
    );
  }
}




ImageTextEdit.propTypes = {};


function mapStateToProps({ memeberTag, types }) {
  return {
    memeberTag,
    types
  };
}

const WrappedImageTextEdit = Form.create()(ImageTextEdit);

export default connect(mapStateToProps)(WrappedImageTextEdit);
