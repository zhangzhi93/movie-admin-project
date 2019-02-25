import React, { Component } from 'react'
import { Link } from 'dva/router';
import { Card, Icon } from 'antd'
import styles from './Public.less';

class ImageTextCard extends Component {
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
    const { record, record: { imageTextItemList, id }, selected, ImageTextDelete, showAction, isEditable, isDeletable, isCloneable } = this.props;

    const actionsBtn = [
      isCloneable ? <Link to={{ pathname: `/Tweets/ImageText/edit/${id}`, search: `?copy=1` }}><span>复制</span></Link> : null,
      isEditable ? <Link to={`/Tweets/ImageText/edit/${id}`}><span>编辑</span></Link> : null,
      isDeletable ? <span onClick={() => ImageTextDelete(id)}>删除</span> : null,
    ]

    return (
      <Card className={styles.ImageTextcard}
        onClick={this.select(record)}
        actions={showAction ? actionsBtn : null}
      >
        <div className={styles.container}>
          {
            (imageTextItemList && imageTextItemList.length > 0) ?
              imageTextItemList.map((item, index) => {
                if (index === 0) {
                  return (
                    <div className={styles.item}>
                      <div className={styles.poster}>
                        <img src={item.coverUrl} alt={item.title} />
                        <strong>{item.title}</strong>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div className={styles.item}>
                      <div className={styles.band}>
                        <div className={styles.subtitle}>
                          <p>{item.title}</p>
                        </div>
                        <div className={styles.subImage}>
                          <img src={item.coverUrl} alt={item.subtitle} />
                        </div>
                      </div>
                    </div>
                  )
                }
              }) : null
          }
        </div>
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

export default ImageTextCard
