
import React from 'react';
import { Modal } from 'antd';
import styles from './Public.less';

function NoPermission({
  ...modalProps
}) {
  const modalOpts = {
    ...modalProps,
    title: '暂无权限',
    width: 610,
  };

  return (
    <Modal {...modalOpts}>
      <div className={styles.modal}>
        您好，您无权访问此功能，请联系管理员开通权限！
      </div>
    </Modal>
  );
}

export default NoPermission;
