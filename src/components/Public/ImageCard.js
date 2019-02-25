import { Component } from 'react'
import { Card, Icon } from 'antd'
import styles from './Public.less';

class ImageCard extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  select = (record) => {
    const { selectCard } = this.props;
    if (selectCard) {
      selectCard(record);
    }
  }

  render() {
    const { showAction, ImageEdit, ImageDelete, record, selected, imageUrl, isEditable, isDeletable } = this.props
    const url = imageUrl ? imageUrl : record.imageUrl;
    const actionsBtn = [
      isEditable ? <span onClick={() => ImageEdit(record.id)}>编辑</span> : null,
      isDeletable ? <span onClick={() => ImageDelete(record.id)}>删除</span> : null,
    ]

    return (
      <Card className={styles.imageCard}
        actions={showAction ? actionsBtn : null}
        cover={<img alt={record.name} src={url} />}
        onClick={this.select(record)}
      >
        {
          selected ?
            <div className={styles.shade}>
              <Icon type="check" theme="outlined" />
            </div> : null
        }
      </Card>
    )
  }
}

export default ImageCard
