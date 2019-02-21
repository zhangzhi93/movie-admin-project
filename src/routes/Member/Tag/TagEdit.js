import { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Form, Card, Input, Button, Breadcrumb, Select, message } from 'antd';
import styles from '../index.less';

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

const conditionKeyText = ['小于', '等于', '大于'];
const conditionTypeText = ['观影次数', '影片类型', '购票金额'];
const dateTypeText = ['每日', '每月', '每年度'];


class TagEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagConditionVOList: [],
      dateType: 0,
      conditionType: 0,
      conditionKey: 0,
      conditionValue: 1,
      relationStatus: 1,
      isUpdate: false,
      index: 0
    };
  }

  componentDidMount() {
    const { params: { id }, dispatch, form: { setFieldsValue } } = this.props;
    if (id !== '0') {
      dispatch({
        type: 'memeberTag/getMemberTagById',
        payload: { id },
        callback: res => {
          if (res.msg === 'SUCCESS') {
            this.setState({
              tagConditionVOList: res.data.listTagConditionVO,
              relationStatus: res.data.listTagConditionVO[0].relationStatus
            })
          }
        }
      })
    } else {
      setFieldsValue({
        name: '',
        description: ''
      })
    }
  }

  addTagGroup = () => {
    const { tagConditionVOList, dateType, conditionType, conditionKey, conditionValue, relationStatus } = this.state;
    let list = tagConditionVOList;
    let key = conditionKey;
    if (conditionType == '1') {
      key = '1';
    }
    list.push({
      dateType,
      conditionType,
      conditionKey: key,
      conditionValue,
      relationStatus
    });
    this.setState({
      tagConditionVOList: list
    })
  }

  saveTagGroup = () => {
    const { tagConditionVOList, dateType, conditionType, conditionKey, conditionValue, relationStatus, index } = this.state;
    let list = tagConditionVOList;
    let key = conditionKey;
    if (conditionType == '1') {
      key = '1';
    }
    let obj = {
      dateType,
      conditionType,
      conditionKey: key,
      conditionValue,
      relationStatus
    }
    list[index] = obj;
    this.setState({
      tagConditionVOList: list,
      isUpdate: false,
    })
  }

  updateTagGroup = (index) => {
    const { tagConditionVOList } = this.state;
    this.setState({
      dateType: tagConditionVOList[index].dateType,
      conditionType: tagConditionVOList[index].conditionType,
      conditionKey: tagConditionVOList[index].conditionKey,
      conditionValue: tagConditionVOList[index].conditionValue,
      isUpdate: true,
      index: index
    })
  }

  deleteTagGroup = (index) => {
    const { tagConditionVOList } = this.state;
    let list = tagConditionVOList;
    list.splice(index, 1);
    this.setState({
      tagConditionVOList: list
    })
  }

  conditionType = (val) => {
    if (val === 1) {
      this.setState({
        conditionType: val,
        conditionValue: '爱情片'
      })
    } else {
      this.setState({
        conditionType: val,
        conditionValue: 1
      })
    }
  }


  doSave = () => {
    const { dispatch, form: { validateFields }, params: { id }, history } = this.props;
    const { tagConditionVOList } = this.state;
    let taglist = tagConditionVOList;
    let requestUrl = 'memeberTag/addMemberTag';
    if (id != 0) {
      requestUrl = 'memeberTag/updateMemberTag';
    }
    validateFields((err, values) => {
      if (err) {
        return;
      }
      if (taglist.length == 0) {
        message.error("请选择标签定义");
        return;
      } else if (taglist.length == 1) {
        taglist[0].relationStatus = 1;
      }
      dispatch({
        type: requestUrl,
        payload: {
          id,
          ...values,
          tagConditionVOList: taglist
        },
        callback: (res) => {
          if (res.msg == 'SUCCESS') {
            message.success(`${id == 0 ? '新增' : '编辑'}成功`);
            history.goBack();
          }
        }
      })
    });
  }

  //
  render() {
    const { form, params: { id }, memeberTag: { getMemberTagByIdData } } = this.props;
    const { tagConditionVOList, dateType, conditionType, conditionKey, conditionValue, relationStatus, isUpdate } = this.state;
    const { getFieldDecorator } = form;
    return (
      <div className="template">
        <Breadcrumb separator=">>">
          <Breadcrumb.Item>用户管理</Breadcrumb.Item>
          <Breadcrumb.Item className="breadcrumb-active">
            {id === '0' ? '新增标签' : '编辑标签'}
          </Breadcrumb.Item>
        </Breadcrumb>
        <Card
          title={id === '0' ? '新增标签' : '编辑标签'}
          extra={
            <div>
              <Button size="large" ghost onClick={() => this.props.history.goBack()}>取消</Button>
              <Button size="large" type="primary" ghost onClick={this.doSave}>提交</Button>
            </div>
          }
        >
          <Form>
            <FormItem {...formItemLayout} label="标签名称">
              {getFieldDecorator('name', {
                initialValue: getMemberTagByIdData.name || '',
                rules: [
                  { required: true, message: '活动名称不能为空' },
                  { max: 10, message: '不能大于10个字符' },
                ],
              })(
                <Input maxLength="10" style={{ width: 260 }} placeholder="请输入" />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="标签描述">
              {getFieldDecorator('description', {
                initialValue: getMemberTagByIdData.description || '',
              })(
                <TextArea placeholder="请输入标签描述" rows={3} style={{ width: 260 }} maxLength={300} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="标签定义">
              <p className={styles.tip}>满足以下条件的人，将会自动被打上标签</p>
              <div className={styles.tagContainer}>
                <div>
                  <Select value={relationStatus} onChange={(val) => this.setState({ relationStatus: val })}>
                    <Option value={0}>且</Option>
                    <Option value={1}>或</Option>
                  </Select>
                </div>
                <div>
                  {
                    tagConditionVOList.map((item, index) => {
                      return (
                        <div>
                          <p style={{ display: 'inline-block' }}>{dateTypeText[item.dateType]}-{conditionTypeText[item.conditionType]}{item.conditionKey == 1 ? '' : '-' + conditionKeyText[item.conditionKey]}-{item.conditionValue}</p>
                          <Button type="danger" size="small" onClick={() => this.deleteTagGroup(index)}>删除</Button>
                          <Button type="danger" size="small" onClick={() => this.updateTagGroup(index)}>编辑</Button>
                        </div>
                      )
                    })
                  }
                  <Select className={styles.select} value={dateType} onChange={(val) => this.setState({ dateType: val })}>
                    <Option value={0}>每日</Option>
                    <Option value={1}>每月</Option>
                    <Option value={2}>每年度</Option>
                  </Select>
                  <Select className={styles.select} value={conditionType} onChange={this.conditionType}>
                    <Option value={0}>观影次数</Option>
                    <Option value={1}>影片类型</Option>
                    <Option value={2}>购票金额</Option>
                  </Select>
                  {
                    conditionType !== 1 ?
                      <Select className={styles.select} value={conditionKey} onChange={(val) => this.setState({ conditionKey: val })}>
                        <Option value={0}>小于</Option>
                        <Option value={1}>等于</Option>
                        <Option value={2}>大于</Option>
                      </Select> : null
                  }
                  {
                    conditionType === 0 ?
                      <div className={styles.select}><Input value={conditionValue} onChange={(e) => this.setState({ conditionValue: e.target.value })} style={{ width: 130, marginRight: 6 }} placeholder="请输入" />次</div> : null
                  }
                  {
                    conditionType === 1 ?
                      <Select className={styles.select} style={{ width: 130 }} value={conditionValue} onChange={(val) => this.setState({ conditionValue: val })}>
                        <Option value="爱情片">爱情片</Option>
                        <Option value="剧情片">剧情片</Option>
                        <Option value="喜剧片">喜剧片</Option>
                        <Option value="家庭片">家庭片</Option>
                        <Option value="伦理片">伦理片</Option>
                        <Option value="文艺片">文艺片</Option>
                        <Option value="音乐片">音乐片</Option>
                        <Option value="歌舞片">歌舞片</Option>
                        <Option value="动漫片">动漫片</Option>
                        <Option value="西部片">西部片</Option>
                        <Option value="武侠片">武侠片</Option>
                        <Option value="古装片">古装片</Option>
                        <Option value="动作片">动作片</Option>
                        <Option value="恐怖片">恐怖片</Option>
                        <Option value="惊悚片">惊悚片</Option>
                        <Option value="冒险片">冒险片</Option>
                        <Option value="犯罪片">犯罪片</Option>
                        <Option value="悬疑片">悬疑片</Option>
                        <Option value="记录片">记录片</Option>
                        <Option value="战争片">战争片</Option>
                        <Option value="历史片">历史片</Option>
                        <Option value="传记片">传记片</Option>
                        <Option value="体育片">体育片</Option>
                        <Option value="科幻片">科幻片</Option>
                        <Option value="魔幻片">魔幻片</Option>
                        <Option value="奇幻片">奇幻片</Option>
                      </Select> : null
                  }
                  {
                    conditionType === 2 ?
                      <div className={styles.select}><Input size="large" value={conditionValue} onChange={(e) => this.setState({ conditionValue: e.target.value })} style={{ width: 130 }} placeholder="请输入" />元</div> : null
                  }
                  {
                    isUpdate ?
                      <Button type="primary" size="default" onClick={this.saveTagGroup}>保存</Button>
                      :
                      <Button type="primary" size="default" onClick={this.addTagGroup}>新增</Button>
                  }
                </div>
              </div>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}

TagEdit.propTypes = {};


function mapStateToProps({ memeberTag }) {
  return {
    memeberTag
  };
}

const WrappedTagEdit = Form.create()(TagEdit);

export default connect(mapStateToProps)(WrappedTagEdit);
