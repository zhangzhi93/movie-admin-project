import { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Form, Card, Select, message, Col, Icon, DatePicker, Input, Radio, Button, Modal, Upload, Switch, Breadcrumb } from 'antd';
import config from '../../utils/config';
import styles from './style.less';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const FormItem = Form.Item;
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

@connect(({ store, common, loading }) => ({
  store,
  common,
  loading: loading.models.store,
}))
@Form.create()
class StoreEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      urlList: [],
      description: '',
      activityDetail: '',
      evaluateStatus: false,
      listImageUrl: '',
      loading: false,
      sloading: false,
      previewVisible: false,
      previewImage: '',
    };
  }

  componentDidMount() {
    const { dispatch, form, params: { id } } = this.props;
    const _this = this;

    dispatch({
      type: 'common/getProvinces',
      callback: function (res) {
        if (id !== '0') {
          dispatch({
            type: 'store/getStoreById',
            payload: { id },
            callback: (res2) => {
              const { data: { imageVOList, description, activityDetail, evaluateStatus, listImageUrl } } = res2;
              let imgList = [];
              let urlList = [];
              if (imageVOList.length !== 0) {
                imageVOList.forEach((val, index) => {
                  let obj = {};
                  obj.uid = val.id;
                  obj.status = 'done';
                  obj.url = val.imageUrl;
                  imgList.push(obj)
                  urlList.push(val.linkUrl);
                });
              }
              _this.setState({
                fileList: imgList,
                urlList,
                description,
                activityDetail,
                listImageUrl,
                evaluateStatus: evaluateStatus == 1 ? true : false
              });
              dispatch({
                type: 'common/getCitys',
                payload: {
                  id: res2.data.provinceId
                },
                callback: function (city) {
                  if (city.status === 0) {
                    dispatch({
                      type: 'common/getCountys',
                      payload: {
                        id: res2.data.cityId
                      },
                      callback: function (county) {
                        if (county.status === 0) {
                          form.setFieldsValue({
                            provinceId: res2.data.provinceId,
                            cityId: res2.data.cityId,
                            countyId: res2.data.countyId,
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        } else {
          form.setFieldsValue({
            provinceId: ''
          })
          dispatch({
            type: 'store/save',
            payload: {
              getStoreByIdData: []
            }
          })
        }
      }
    });
  }

  //省改变
  handleChangeProvince = (value) => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'common/getCitys',
      payload: {
        id: value
      },
      callback: function (data) {
        if (data.status === 0) {
          form.setFieldsValue({
            cityId: '',
            countyId: ''
          })
        }
      }
    })
  }

  //市改变
  handleChangeCity = (value) => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'common/getCountys',
      payload: {
        id: value
      },
      callback: function (data) {
        if (data.status === 0) {
          form.setFieldsValue({
            countyId: ''
          })
        }
      }
    })
  }

  handleChangeList = ({ fileList }) => this.setState({ fileList });

  handleChangeImg = ({ file }) => {
    if (file.status === 'uploading') {
      this.setState({ sloading: true });
      return;
    }
    if (file.status === 'done') {
      this.setState({ listImageUrl: file.response.data });
    }
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  onChange_evaluateStatus = () => {
    const { evaluateStatus } = this.state;
    this.setState({
      evaluateStatus: !evaluateStatus,
    });
  }

  doSave = (e) => {
    e.preventDefault();
    const userType = localStorage.getItem('userType');
    const { form, dispatch, params: { id }, history } = this.props;
    const { fileList, description, activityDetail, evaluateStatus, listImageUrl } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (!listImageUrl) {
        message.error('请上传门店列表图');
        return;
      }
      let requestUrl = 'store/addStore';
      if (id !== 0) {
        requestUrl = 'store/updateStore';
      }
      values.evaluateStatus = evaluateStatus ? 1 : 0;
      values.description = description;
      values.activityDetail = activityDetail;
      values.listImageUrl = listImageUrl;
      let imageParamVOList = [];
      fileList.forEach((val, index) => {
        let obj = {};
        if (val.response) {
          obj.imageUrl = val.response.data;
        } else {
          obj.imageUrl = val.url;
        }
        obj.linkUrl = values['linkUrl_' + index];
        delete values['linkUrl_' + index];
        imageParamVOList.push(obj);
      });
      values.imageParamVOList = imageParamVOList;
      dispatch({
        type: requestUrl,
        payload: {
          ...values,
          id: id
        },
        callback: res => {
          if (res.msg == 'SUCCESS') {
            message.success(id == 0 ? '增加成功' : '编辑成功');
            if (userType != 1) {
              history.goBack();
            } else {
              dispatch({
                type: 'store/getStoreById',
                payload: { id },
                callback: (res2) => {
                  const { data: { imageVOList, description, activityDetail, evaluateStatus, listImageUrl } } = res2;
                  let imgList = [];
                  let urlList = [];
                  if (imageVOList.length !== 0) {
                    imageVOList.forEach((val, index) => {
                      let obj = {};
                      obj.uid = val.id;
                      obj.status = 'done';
                      obj.url = val.imageUrl;
                      imgList.push(obj)
                      urlList.push(val.linkUrl);
                    });
                  }
                  this.setState({
                    fileList: imgList,
                    urlList,
                    description,
                    activityDetail,
                    listImageUrl,
                    evaluateStatus: evaluateStatus == 1 ? true : false
                  });
                  dispatch({
                    type: 'common/getCitys',
                    payload: {
                      id: res2.data.provinceId
                    },
                    callback: function (city) {
                      if (city.status === 0) {
                        dispatch({
                          type: 'common/getCountys',
                          payload: {
                            id: res2.data.cityId
                          },
                          callback: function (county) {
                            if (county.status === 0) {
                              form.setFieldsValue({
                                provinceId: res2.data.provinceId,
                                cityId: res2.data.cityId,
                                countyId: res2.data.countyId,
                              })
                            }
                          }
                        })
                      }
                    }
                  })
                }
              })
            }
          } else {
            message.error(res.msg);
          }
        }
      });
    });
  }

  render() {
    const { previewVisible, previewImage, fileList, urlList, activityDetail, description, evaluateStatus, listImageUrl, loading, sloading } = this.state;
    const { form, params: { id }, common, store: { getStoreByIdData } } = this.props;
    const { Provinces, Citys, Countys } = common;
    const { getFieldDecorator } = form;
    const userType = localStorage.getItem('userType');
    const handleChange_description = (value) => {
      if (value.length >= 685466 * 3) {
        message.error("门店内容不能大于1500K");
        this.setState({ description: description });
        return;
      }
      this.setState({ description: value });
    }
    const handleChange_activityDetail = (value) => {
      if (value.length >= 685466 * 3) {
        message.error("活动内容不能大于1500K");
        this.setState({ activityDetail: activityDetail });
        return;
      }
      this.setState({ activityDetail: value });
    }

    const uploadButton = (
      <div>
        <Icon type={sloading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const uploadButtonList = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className="template">
        <Breadcrumb separator=">>">
          <Breadcrumb.Item>门店管理</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-active">
            {id === '0' ? '新增门店' : '编辑门店'}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Card
          title={id === '0' ? '新增门店' : '编辑门店'}
          extra={
            <div>
              {
                userType == 0 ?
                  <Button size="large" ghost onClick={() => this.props.history.goBack()}>取消</Button>
                  : null
              }
              <Button size="large" type="primary" ghost onClick={this.doSave}>提交</Button>
            </div>
          }
        >
          <Form>
            <FormItem {...formItemLayout} label="门店名称">
              {getFieldDecorator('name', {
                initialValue: getStoreByIdData.name || '',
                rules: [
                  { required: true, message: '活动名称不能为空' },
                  { max: 15, message: '不能大于15个字符' },
                ],
              })(
                <Input maxLength="15" style={{ width: 260 }} placeholder="请输入" />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              required
              label="门店地址">
              {getFieldDecorator('provinceId', {
                initialValue: getStoreByIdData.provinceId || '',
                rules: [
                  { required: true, message: '省份不能为空' },
                ],
              })(
                <Select className={styles.select} onChange={this.handleChangeProvince} getPopupContainer={trigger => trigger.parentNode}>
                  <Option value=''>请选择</Option>
                  {
                    Provinces.map((o) => {
                      return (
                        <Option key={o.id} value={o.id}>{o.name}</Option>
                      );
                    })
                  }
                </Select>,
              )}
              {getFieldDecorator('cityId', {
                initialValue: getStoreByIdData.cityId || '',
                rules: [
                  { required: true, message: '市不能为空' },
                ],
              })(
                <Select className={styles.select} onChange={this.handleChangeCity} getPopupContainer={trigger => trigger.parentNode}>
                  <Option value=''>请选择</Option>
                  {
                    Citys.map((o) => {
                      return (
                        <Option key={o.id} value={o.id}>{o.name}</Option>
                      );
                    })
                  }
                </Select>,
              )}
              {getFieldDecorator('countyId', {
                initialValue: getStoreByIdData.countyId || '',
                rules: [
                  { required: true, message: '区不能为空' },
                ],
              })(
                <Select className={styles.select} getPopupContainer={trigger => trigger.parentNode}>
                  <Option value=''>请选择</Option>
                  {
                    Countys.map((o) => {
                      return (
                        <Option key={o.id} value={o.id}>{o.name}</Option>
                      );
                    })
                  }
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} colon={false} label="详细地址">
              {getFieldDecorator('address', {
                initialValue: getStoreByIdData.address || '',
                rules: [
                  { required: true, message: '详细地址不能为空' },
                ],
              })(
                <Input maxLength="50" placeholder="详细地址" style={{ width: '430px' }} />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="门店列表图">
              <Upload
                action={`${config.url}/oss/upload`}
                listType="picture-card"
                showUploadList={false}
                onChange={this.handleChangeImg}
              >
                {listImageUrl ? <img src={listImageUrl} alt="avatar" className={styles.img} /> : uploadButton}
              </Upload>
            </FormItem>
            {
              userType == 1 ?
                <div>
                  <FormItem {...formItemLayout} label="门店轮播图">
                    <Upload
                      action={`${config.url}/oss/upload`}
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={this.handlePreview}
                      onChange={this.handleChangeList}
                    >
                      {fileList.length >= 5 ? null : uploadButtonList}
                    </Upload>
                  </FormItem>
                  {
                    fileList.length > 0 ? <FormItem {...formItemLayout} label="轮播图1链接">
                      {getFieldDecorator('linkUrl_0', {
                        initialValue: urlList[0] || ''
                      })(
                        <Input maxLength="500" placeholder="轮播图1链接" style={{ width: '430px' }} />,
                      )}
                    </FormItem> : null
                  }
                  {
                    fileList.length > 1 ? <FormItem {...formItemLayout} label="轮播图2链接">
                      {getFieldDecorator('linkUrl_1', {
                        initialValue: urlList[1] || ''
                      })(
                        <Input maxLength="500" placeholder="轮播图2链接" style={{ width: '430px' }} />,
                      )}
                    </FormItem> : null
                  }
                  {
                    fileList.length > 2 ? <FormItem {...formItemLayout} label="轮播图3链接">
                      {getFieldDecorator('linkUrl_2', {
                        initialValue: urlList[2] || ''
                      })(
                        <Input maxLength="500" placeholder="轮播图3链接" style={{ width: '430px' }} />,
                      )}
                    </FormItem> : null
                  }
                  {
                    fileList.length > 3 ? <FormItem {...formItemLayout} label="轮播图4链接">
                      {getFieldDecorator('linkUrl_3', {
                        initialValue: urlList[3] || ''
                      })(
                        <Input maxLength="500" placeholder="轮播图4链接" style={{ width: '430px' }} />,
                      )}
                    </FormItem> : null
                  }
                  {
                    fileList.length > 4 ? <FormItem {...formItemLayout} label="轮播图5链接">
                      {getFieldDecorator('linkUrl_4', {
                        initialValue: urlList[4] || ''
                      })(
                        <Input maxLength="500" placeholder="轮播图5链接" style={{ width: '430px' }} />,
                      )}
                    </FormItem> : null
                  }
                  <FormItem {...formItemLayout} label="门店联系人">
                    {getFieldDecorator('contactMan', {
                      initialValue: getStoreByIdData.contactMan || '',
                      rules: [
                        { max: 15, message: '不能大于15个字符' },
                      ],
                    })(
                      <Input maxLength="15" style={{ width: 260 }} placeholder="请输入" />,
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="门店联系电话">
                    {getFieldDecorator('contactNumber', {
                      initialValue: getStoreByIdData.contactNumber || '',
                      rules: [
                        { max: 15, message: '不能大于15个字符' },
                      ],
                    })(
                      <Input maxLength="15" style={{ width: 260 }} placeholder="请输入" />,
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="是否开启评价">
                    <Switch checkedChildren="开" unCheckedChildren="关" checked={evaluateStatus} onChange={this.onChange_evaluateStatus} />
                  </FormItem>
                  <FormItem {...formItemLayout} label="客服电话">
                    {getFieldDecorator('serviceTelephone', {
                      initialValue: getStoreByIdData.serviceTelephone || '',
                      rules: [
                        { max: 15, message: '不能大于15个字符' },
                      ],
                    })(
                      <Input maxLength="15" style={{ width: 260 }} placeholder="请输入" />,
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="门店介绍">
                    <ReactQuill
                      className={styles.quill}
                      value={description}
                      onChange={handleChange_description}
                    />
                  </FormItem>
                  <FormItem {...formItemLayout} label="最新活动">
                    <ReactQuill
                      className={styles.quill}
                      value={activityDetail}
                      onChange={handleChange_activityDetail}
                    />
                  </FormItem>
                </div> : null
            }
          </Form>
        </Card>
        <Modal visible={previewVisible} footer={null} onCancel={() => { this.setState({ previewVisible: false }) }}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div >
    );
  }
}

StoreEdit.propTypes = {};

export default StoreEdit;
