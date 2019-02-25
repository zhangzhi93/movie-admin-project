import React from 'react'
import { Modal, Radio } from 'antd'

const RadioGroup = Radio.Group

class StateModel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      value: this.props.status
    }
  }

  //  显示弹窗
  show_modal = () => {
    this.setState({
      visible: true,
      value: this.props.status
    })
  }
  //  提交
  ok = async () => {
    const { ok, status } = this.props;
    if (status != this.state.value) {
      ok(this.state.value);
    }
    this.setState({ visible: false })
  }
  //  隐藏弹窗
  hide_modal = () => {
    this.setState({ visible: false })
  }
  //  值改变
  onChange = (e) => {
    this.setState({ value: e.target.value })
  }

  render() {
    const { status, isEnable, name, statusArray } = this.props
    const { visible } = this.state;

    return (
      <div>
        {
          isEnable ?
            <a onClick={this.show_modal}>
              {status == '0' ? <span className="status-able">{statusArray[0]}</span> : <span className="status-disable">{statusArray[1]}</span>}
            </a>
            : <div>{status == '0' ? <span className="status-nomal">{statusArray[0]}</span> : <span className="status-danger">{statusArray[1]}</span>}</div>
        }

        <span onClick={this.show_modal}>{this.props.children}</span>

        <Modal
          title='修改状态'
          visible={visible}
          onOk={this.ok}
          onCancel={this.hide_modal}
          width='610px'
          bodyStyle={{ textAlign: 'center' }}
        >
          <label className="state-model-label">{name}状态: </label>
          <RadioGroup onChange={this.onChange} defaultValue={status} value={this.state.value}>
            <Radio value='0'>{statusArray[0]}</Radio>
            <Radio value='1'>{statusArray[1]}</Radio>
          </RadioGroup>
        </Modal>
      </div >
    )
  }
}

export default StateModel
