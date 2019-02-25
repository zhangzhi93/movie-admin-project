import { Component } from 'react';
import { Layout, Form, Row, Col, Input, Modal } from 'antd';
import style from '../index.less';

const FormItem = Form.Item;
const { TextArea } = Input;

class TypesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSubmit = () => {
    const { onOk, form: { validateFields }, typesInfoById: { id } } = this.props;
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
    const { form: { getFieldDecorator }, visible, typesInfoById } = this.props;
    return (
      <Layout>
        <Modal
          title={typesInfoById.id ? '编辑分类' : '新增分类'}
          visible={visible}
          onOk={this.onSubmit}
          onCancel={this.closeModal}
          width={520}
        >
          <Form>
            <Row>
              <Col span={24}>
                <FormItem label="分类名称" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  {getFieldDecorator('name', {
                    initialValue: typesInfoById.name,
                    rules: [
                      { required: true, message: '请填写分类名称' }
                    ],
                  })(
                    <Input maxLength="10" style={{ width: 280 }} placeholder="请输入分类名称" />,
                  )}
                </FormItem>
                <FormItem label="分类描述" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  {getFieldDecorator('description', {
                    initialValue: typesInfoById.description,
                    rules: [
                      { required: true, message: '请填写分类描述' }
                    ],
                  })(
                    <TextArea placeholder="请输入分类描述" rows={3} style={{ width: 280 }} maxLength={300} />
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

TypesModal.propTypes = {};


const WrappedTypesModal = Form.create({
  mapPropsToFields(props) {
    return {
      name: { value: props.typesInfoById.name },
      description: { value: props.typesInfoById.description }
    };
  }
})(TypesModal);

export default WrappedTypesModal;
