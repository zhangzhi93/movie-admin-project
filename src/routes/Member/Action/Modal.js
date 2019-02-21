import { Component } from 'react';
import { Layout, Form, Row, Col, Input, Modal } from 'antd';
import style from '../index.less';

const FormItem = Form.Item;
const { TextArea } = Input;

class GroupModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSubmit = () => {
    const { onOk, form: { validateFields }, groupInfoById: { id } } = this.props;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      onOk(values, id);
    });
  }

  closeModal = () => {
    const { onCancel } = this.props;
    onCancel();
  }

  render() {
    const { form: { getFieldDecorator }, visible, groupInfoById } = this.props;
    return (
      <Layout>
        <Modal
          title={groupInfoById.id ? '编辑组别' : '新增组别'}
          visible={visible}
          onOk={this.onSubmit}
          onCancel={this.closeModal}
          width={520}
        >
          <Form>
            <Row>
              <Col span={24}>
                <FormItem label="组别名称" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  {getFieldDecorator('name', {
                    initialValue: groupInfoById.name,
                    rules: [
                      { required: true, message: '请填写组别名称' }
                    ],
                  })(
                    <Input maxLength="10" style={{ width: 280 }} placeholder="请输入组别名称" />,
                  )}
                </FormItem>
                <FormItem label="组别描述" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  {getFieldDecorator('description', {
                    initialValue: groupInfoById.description,
                    rules: [
                      { required: true, message: '请填写组别描述' }
                    ],
                  })(
                    <TextArea placeholder="请输入组别描述" rows={3} style={{ width: 280 }} maxLength={300} />
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

GroupModal.propTypes = {};


const WrappedGroupModal = Form.create()(GroupModal);

export default WrappedGroupModal;
