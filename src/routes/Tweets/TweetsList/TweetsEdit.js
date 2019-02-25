import { Component } from 'react';
import { connect } from 'dva';
import { Form, Card, Layout, Row, Col, Icon, Select, Input, Switch, Button, Tabs, Upload, Modal, Breadcrumb, message, Radio } from 'antd';
import ImageCard from '../../../components/Public/ImageCard';
import ImageTextCard from '../../../components/Public/ImageTextCard';
import config from '../../../utils/config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from '../index.less';
import QRCode from 'qrcode';
import { patternUrl } from '../../../utils/regex';

const RadioGroup = Radio.Group
const FormItem = Form.Item;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;

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
// 135编辑器的appkey
const appkey = '5bd65977-c4f4-4a78-bd74-06e8ac10c65d'


class TweetsEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      Tvisible: false,
      Wvisible: false,
      saved: false,
      Wsaved: false,
      pcVisible: false,//pc 本地预览
      pcPreviewContent: '',//pc 预览内容
      editStatus: false,
      active: 0,
      wechatMediaId: '',
      ossUrl: '',
      wechatUrl: '',
      isShowOutPage: false,
      selectRecord: {},
      ImageTextList: [],
      selectType: 0,
      loading: false,
      openId: '',
      previewId: '',
      author: '',
      externalUrl: '',
      sendIgnoreReprint: '0',
    };
  }

  componentDidMount() {
    message.loading('正在拼命加载中 ...', 0);
    const { dispatch, params: { id }, form: { setFieldsValue } } = this.props;
    dispatch({
      type: 'imagetext/getImageTextNotRichList',
      payload: {
        page: 1,
        rows: 10
      },
      callback: (res) => {
        message.destroy();
      }
    });
    dispatch({
      type: 'images/getImageList',
      payload: {
        page: 1,
        rows: 10
      }
    });
    dispatch({
      type: 'types/getClassifyOption'
    })
    if (id !== '0') {
      dispatch({
        type: 'auditing/getTweetAuditRecordById',
        payload: { id },
        callback: (res) => {
          if (res.msg == 'SUCCESS') {
            const { data, data: { imageTextItemList } } = res;
            const length = imageTextItemList.length;
            //console.log("imageTextItemList[0]: ",imageTextItemList[0]);
            this.setState({
              editStatus: true,
              selectRecord: data,
              ImageTextList: data.imageTextItemList,
              //articleDetail: length == 0 ? '' : res.data.imageTextItemList[0].articleDetail,
              ossUrl: length == 0 ? '' : imageTextItemList[0].coverUrl,
              wechatMediaId: length == 0 ? '' : imageTextItemList[0].wechatMediaId,
              wechatUrl: length == 0 ? '' : imageTextItemList[0].wechatUrl,
              isShowOutPage: length == 0 ? '' : imageTextItemList[0].contentType == 1 ? true : false,
              author: length == 0 ? '' : imageTextItemList[0].author,
              externalUrl: length == 0 ? '' : imageTextItemList[0].externalUrl,
            }, () => {
              setFieldsValue({
                title: length == 0 ? '' : imageTextItemList[0].title,
                abstractStr: length == 0 ? '' : imageTextItemList[0].abstractStr,
                classifyId: length == 0 ? '' : imageTextItemList[0].classifyId,
                author: length == 0 ? '' : imageTextItemList[0].author,
                externalUrl: length == 0 ? '' : imageTextItemList[0].externalUrl,
              });
              this.initEditor();
              //初始化编辑器赋值
              current_editor.addListener("ready", function () {
                current_editor.setContent(imageTextItemList[0].articleDetail);
              });
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
  }

  showEdit = () => {
    const { dispatch, form: { setFieldsValue } } = this.props;
    const { selectRecord, selectType } = this.state;
    if (selectType == 0) {
      // 读取 selectRecord 的值
      dispatch({
        type: 'imagetext/getImageTextById',
        payload: { id: selectRecord.id },
        callback: (res) => {
          if (res.status === 0) {
            const { data, data: { imageTextItemList } } = res;
            const length = imageTextItemList.length;
            //console.log("imageTextItemList[0]: ",imageTextItemList[0]);
            this.setState({
              selectRecord: data,
            }, () => {
              this.setState({
                visible: false,
                editStatus: true,
                ImageTextList: data.imageTextItemList,
                ossUrl: data.imageTextItemList[0].coverUrl,
                wechatMediaId: data.imageTextItemList[0].wechatMediaId,
                wechatUrl: data.imageTextItemList[0].wechatUrl,
                isShowOutPage: data.imageTextItemList[0].contentType == 1 ? true : false,
                externalUrl: data.imageTextItemList[0].externalUrl,
                author: data.imageTextItemList[0].author,
              }, () => {
                setFieldsValue({
                  title: data.imageTextItemList[0].title,
                  abstractStr: data.imageTextItemList[0].abstractStr,
                  classifyId: data.imageTextItemList[0].classifyId,
                  externalUrl: data.imageTextItemList[0].externalUrl,
                  author: data.imageTextItemList[0].author,
                });
                this.initEditor();
                //初始化编辑器赋值
                current_editor.addListener("ready", function () {
                  current_editor.setContent(data.imageTextItemList[0].articleDetail);
                });
              });
            });
          }
        }
      })
    } else {
      this.setState({
        visible: false,
        editStatus: true,
      })
    }
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
    const { ImageTextList, active, ossUrl, wechatMediaId, wechatUrl, isShowOutPage } = this.state;
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
      copyList[active].contentType = '0'; // 正文类型：0文章详情，1外部链接
      //得到上个图文编辑器的值
      copyList[active].articleDetail = current_editor.getContent();
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
                      //message.success('success!');
                    })
                  })
                }
                else {
                  message.error(res1.msg);
                }
              }
            })
          }
          else {
            message.error(res.msg);
          }
        }
      })
    });
  }

  //微信预览
  pushWechat = () => {
    const { dispatch, form: { validateFields } } = this.props;
    const { ImageTextList, active, ossUrl, wechatMediaId, wechatUrl, isShowOutPage, openId } = this.state;
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
      copyList[active].contentType = '0'; // 正文类型：0文章详情，1外部链接
      //得到上个图文编辑器的值
      copyList[active].articleDetail = current_editor.getContent();
      dispatch({
        type: 'imagetext/savePreviewImageText',
        payload: {
          imageTextParamVOList: copyList,
          name: copyList[0].title,
          tweetType: 0,
        },
        callback: (res) => {
          if (res.status === 0) {
            this.setState({
              Wsaved: true,
              previewId: res.data.id
            })
          }
          else {
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
    dispatch({
      type: 'imagetext/PreviewWechatImageText',
      payload: {
        id: previewId,
        openId
      },
      callback: res => {
        if (res.status === 0) {
          this.setState({
            Wsaved: false,
          })
          message.success('推送成功');
        } else {
          message.error(res.msg)
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
      articleDetail: ImageTextList[index].articleDetail
    }, () => {
      setFieldsValue({
        title: ImageTextList[index].title,
        abstractStr: ImageTextList[index].abstractStr,
        classifyId: ImageTextList[index].classifyId,
        externalUrl: ImageTextList[index].externalUrl,
        author: ImageTextList[index].author,
      })
    })
  }

  editImageText = (index) => {
    const { form: { validateFields, setFieldsValue } } = this.props;
    const { ImageTextList, active, ossUrl, wechatMediaId, wechatUrl, isShowOutPage } = this.state;
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
      //保存上个正在编辑的图文编辑器的值
      copyList[active].articleDetail = current_editor.getContent();
      //要编辑的图文编辑器赋值
      current_editor.setContent(ImageTextList[index].articleDetail);
      this.setState({
        ImageTextList: copyList,
        active: index,
        ossUrl: ImageTextList[index].coverUrl,
        wechatMediaId: ImageTextList[index].wechatMediaId,
        wechatUrl: ImageTextList[index].wechatUrl,
        isShowOutPage: ImageTextList[index].contentType == '1' ? true : false,
        articleDetail: ImageTextList[index].articleDetail
      }, () => {
        setFieldsValue({
          title: ImageTextList[index].title,
          abstractStr: ImageTextList[index].abstractStr,
          classifyId: ImageTextList[index].classifyId,
          externalUrl: ImageTextList[index].externalUrl,
          author: ImageTextList[index].author,
        })
      })
    });
  }

  addImageText = () => {
    const { form: { validateFields, setFieldsValue } } = this.props;
    const { ImageTextList, active, ossUrl, wechatMediaId, wechatUrl, isShowOutPage } = this.state;
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
        //得到上个图文编辑器的值
        copyList[active].articleDetail = current_editor.getContent();
        //清空编辑器
        current_editor.setContent('');
        this.setState({
          ImageTextList: copyList,
          active: ImageTextList.length,
          ossUrl: '',
          loading: false,
          isShowOutPage: false,
          articleDetail: ''
        }, () => {
          setFieldsValue({
            title: '',
            abstractStr: '',
            classifyId: '',
            externalUrl: ''
          })
        });
        copyList.push({});
      });
    }
  }

  // 提交审核
  doSave = () => {
    const { dispatch, form: { validateFields }, history, params: { id } } = this.props;
    const { ImageTextList, active, selectRecord, ossUrl, wechatMediaId, wechatUrl, isShowOutPage, selectType } = this.state;
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
      copyList[active].contentType = '0'; // 正文类型：0文章详情，1外部链接
      //保存上个正在编辑的图文编辑器的值
      if (current_editor.getContent) {
        copyList[active].articleDetail = current_editor.getContent();
      }

      // 检查必要字段
      for (var i = 0; i < copyList.length; i++) {
        // 检查编辑器的内容是否有值
        if (copyList[i].articleDetail.length === 0) {
          message.info('图文正文不可为空，请检查！');
          // this.setState({
          //   savedisable: false
          // });
          return;
        }

        //检查封面是否存在
        if (copyList[i].coverUrl.length === 0) {
          message.info('封面不可为空，请检查！');
          // this.setState({
          //   savedisable: false
          // });
          return;
        }

        //检查微信图片地址是否存在
        if (copyList[i].wechatMediaId.length === 0 || copyList[i].wechatUrl.length === 0) {
          message.info('图片未上传微信，请重新添加封面图片！');
          // this.setState({
          //   savedisable: false
          // });
          return;
        }
      }

      let payload = {};
      if (selectType == 0) {
        payload = {
          id,
          tweetType: 0,
          imageTextParamVOList: copyList,
          name: copyList[0].title,
        }
      } else {
        payload = {
          name: selectRecord.name,
          tweetType: 1,
          wechatMediaId: selectRecord.wechatMediaId,
          wechatUrl: selectRecord.wechatUrl,
          tweetUrl: selectRecord.imageUrl
        }
      }

      if (id == 0) {
        dispatch({
          type: 'auditing/auditStoreTweets',　// 提交审核
          payload: payload,
          callback: (res) => {
            if (res.status === 0) {
              message.success("提交审核成功");
              history.goBack();
            }
            else {
              message.error(res.msg);
            }
          }
        })
      } else {
        payload.auditStatus = 0;
        dispatch({
          type: 'auditing/updateTweetAudit',
          payload: payload,
          callback: (res) => {
            if (res.status === 0) {
              message.success("编辑成功");
              history.goBack();
            }
            else {
              message.error(res.msg);
            }
          }
        })
      }
    });
  }
  // 临时保存
  doTempSave = () => {
    const { dispatch, form: { validateFields }, history, params: { id } } = this.props;
    const { ImageTextList, active, selectRecord, ossUrl, wechatMediaId, wechatUrl, isShowOutPage, selectType } = this.state;
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
      copyList[active].contentType = '0'; // 正文类型：0文章详情，1外部链接
      //保存上个正在编辑的图文编辑器的值
      if (current_editor.getContent) {
        copyList[active].articleDetail = current_editor.getContent();
      }

      // 检查必要字段
      for (var i = 0; i < copyList.length; i++) {
        // 检查编辑器的内容是否有值
        if (copyList[i].articleDetail.length === 0) {
          message.info('图文正文不可为空，请检查！');
          // this.setState({
          //   savedisable: false
          // });
          return;
        }

        //检查封面是否存在
        if (copyList[i].coverUrl.length === 0) {
          message.info('封面不可为空，请检查！');
          // this.setState({
          //   savedisable: false
          // });
          return;
        }

        //检查微信图片地址是否存在
        if (copyList[i].wechatMediaId.length === 0 || copyList[i].wechatUrl.length === 0) {
          message.info('图片未上传微信，请重新添加封面图片！');
          // this.setState({
          //   savedisable: false
          // });
          return;
        }
      }

      let payload = {};
      if (selectType == 0) {
        payload = {
          id,
          tweetType: 0,
          imageTextParamVOList: copyList,
          name: copyList[0].title,
        }
      } else {
        payload = {
          name: selectRecord.name,
          tweetType: 1,
          wechatMediaId: selectRecord.wechatMediaId,
          wechatUrl: selectRecord.wechatUrl,
          tweetUrl: selectRecord.imageUrl
        }
      }

      if (id == 0) {
        dispatch({
          type: 'auditing/tempEidtStoreTweets', // 提交临时保存
          payload: payload,
          callback: (res) => {
            if (res.status === 0) {
              message.success("提交保存成功");
              //history.goBack();
            }
            else {
              message.error(res.msg);
            }
          }
        })
      } else {
        dispatch({
          type: 'auditing/updateTweetAudit',
          payload: payload,
          callback: (res) => {
            if (res.status === 0) {
              message.success("编辑成功");
              history.goBack();
            }
            else {
              message.error(res.msg);
            }
          }
        })
      }
    });
  }

  render() {
    const { form: { getFieldDecorator, getFieldValue }, imagetext: { getImageTextNotRichListData }, images, types: { getClassifyOptionData }, params: { id } } = this.props;
    const { visible, loading, ImageTextList, selectRecord, editStatus, active, ossUrl, selectType, pcVisible, pcPreviewContent, sendIgnoreReprint } = this.state;
    const { getImageListData: { content } } = images;
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
      <Layout>
        <Breadcrumb separator=">>">
          <Breadcrumb.Item>推文管理</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-active">{id == '0' ? '新增推文审核' : '编辑推文管理'}</Breadcrumb.Item>
        </Breadcrumb>
        <Card
          title={id == '0' ? '新增推文审核' : '编辑推文管理'}
          extra={
            <div>
              <Button size="large" type="dashed" ghost onClick={() => this.props.history.goBack()}>取消</Button>
              <Button size="large" type="primary" ghost onClick={this.doSave}>提交审核</Button>
              <Button size="large" type="default" ghost onClick={this.doTempSave}>临时保存</Button>
            </div>
          }
        >
          {
            editStatus ?
              selectType == 0 ?
                <Row gutter={15}>
                  <Col span={4}>
                    <Card className={styles.card}>
                      <div className={styles.content}>
                        {
                          ImageTextList.map((item, index) => {
                            return (
                              <div key={item.id} className={`${styles.item} ${active == index ? styles.active : ''}`} onClick={() => this.editImageText(index)}>
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
                        <div key='plus' className={`${styles.item} ${styles.dotted}`} onClick={this.addImageText}>
                          <Icon type="plus" />
                        </div>
                      </div>
                    </Card>
                  </Col>
                  <Col span={16}>
                    <Form>
                      <FormItem {...formItemLayout} label="标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题">
                        {getFieldDecorator('title', {
                          initialValue: '',
                          rules: [
                            { required: true, message: '请输入标题' },
                          ],
                        })(
                          <Input maxLength={64} style={{ width: 500 }} placeholder="请输入标题" />,
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
                      <FormItem {...formItemLayout} required={true} label="正&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;文">
                        <script id="editor" type="text/plain" style={{ width: '100%', height: 500 }}></script>
                      </FormItem>
                      <FormItem style={{ textAlign: 'center' }}>
                        <Button size="large" type="primary" ghost onClick={() => this.setState({ Tvisible: true })}>手机预览</Button>
                        <Button size="large" type="primary" ghost onClick={() => this.setState({ Wvisible: true })}>微信预览</Button>
                        <Button size="large" type="primary" ghost onClick={this.pcPreview}>本地预览</Button>
                      </FormItem>
                    </Form>
                  </Col>
                </Row> :
                <Row>
                  <Col span={8}>
                    <Card className={styles.imageCard}>
                      <div className={styles['ant-card-cover']}>
                        <img alt="example" src={selectRecord.imageUrl} />
                      </div>
                    </Card>
                  </Col>
                </Row> :
              <Form>
                <FormItem label="消息内容" {...formItemLayout}>
                  <div className={styles.seletBtn} onClick={() => { this.setState({ visible: true }) }}>
                    <Icon type='plus' />
                    <div className={styles.seletText}>从素材库中选择</div>
                  </div>
                </FormItem>
              </Form>
          }
        </Card>
        <Modal
          title="选择素材"
          visible={visible}
          onOk={this.showEdit}
          onCancel={() => this.setState({ visible: false })}
          width="1000px"
          style={{ top: 50 }}
          bodyStyle={{ padding: '5px 10px' }}
        >
          <Form layout="inline">
            <FormItem label="名称" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('name', {
              })(
                <Input maxLength="15" size="default" placeholder="请输入消息标题" />,
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" size="default" ghost>搜索</Button>
            </FormItem>
          </Form>
          <Tabs defaultActiveKey="1" size="small" className={styles.userTabs}>
            <TabPane tab="图文" key="1">
              <Row gutter="24">
                {
                  getImageTextNotRichListData.content.map(item => {
                    return (
                      <Col span={6}>
                        <ImageTextCard
                          record={item}
                          selected={(selectRecord.id == item.id && selectType == 0) ? true : false}
                          selectCard={(record) => this.setState({ selectRecord: record, selectType: 0 })}
                        />
                      </Col>
                    )
                  })
                }
              </Row>
            </TabPane>
            <TabPane tab="图片" key="2">
              <Row gutter="24">
                {
                  content.map(item => {
                    return (
                      <Col span={6}>
                        <ImageCard
                          record={item}
                          selected={(selectRecord.id == item.id && selectType == 1) ? true : false}
                          selectCard={(record) => this.setState({ selectRecord: record, selectType: 1 })}
                        />
                      </Col>
                    )
                  })
                }
              </Row>
            </TabPane>
          </Tabs>
        </Modal>
        <Modal
          title="手机预览"
          centered={true}
          maskClosable={false}
          visible={this.state.Tvisible}
          onOk={this.saveItem}
          okText="保存"
          onCancel={() => this.setState({ Tvisible: false, saved: false })}
          style={{ textAlign: 'center' }}
        >
          {
            this.state.saved ? <canvas ref="qrcode"></canvas> : <p>请先点击保存！</p>
          }

        </Modal>
        <Modal
          title="微信预览"
          centered={true}
          maskClosable={false}
          visible={this.state.Wvisible}
          footer={
            <div>
              <Button onClick={this.pushWechat}>保存</Button>
              <Button type="primary" onClick={this.previewWechat}>预览</Button>
            </div>
          }
          onCancel={() => this.setState({ Wvisible: false, Wsaved: false, required: false })}
          style={{ textAlign: 'center' }}
        >
          <Form>
            {
              this.state.Wsaved ?
                <FormItem {...formItemLayout} label="openId">
                  <Input style={{ width: 150 }} placeholder="请输入openId" onChange={(e) => this.setState({ openId: e.target.value })} />
                </FormItem> :
                <p>请先点击保存！</p>
            }
          </Form>
        </Modal>
        <Modal
          title="本地预览"
          centered={true}
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
            {/* <div className={styles.poster}>
              <img src={ossUrl} />
            </div> */}
            <section className={styles.content} dangerouslySetInnerHTML={{ __html: pcPreviewContent }}></section>
          </div>
        </Modal>
      </Layout >
    );
  }
}

TweetsEdit.propTypes = {};


function mapStateToProps({ imagetext, images, types, auditing }) {
  return {
    imagetext,
    types,
    images,
    auditing
  };
}

const WrappedTweetsEdit = Form.create()(TweetsEdit);

export default connect(mapStateToProps)(WrappedTweetsEdit);
