import React from 'react';
import { connect } from 'dva';
import { Route } from 'dva/router';
import { Layout, Breadcrumb } from 'antd';
import styles from './style.less';
import Header from '../components/Layout/Header';
import Slider from '../components/Layout/Slider';
import Index from './IndexPage';

const { Content } = Layout;
const BreadcrumbItem = Breadcrumb.Item;

function IndexPage({ children, app }) {

  const { selectedKeys, userType, storeId } = app;

  return (
    <Layout>
      <Header />
      <Layout>
        <Slider />
        <Layout className={styles.Main}>
          <Breadcrumb separator=">>">
            <BreadcrumbItem>首页</BreadcrumbItem>
          </Breadcrumb>
          <Content>
            <Route path="/Index" exact component={Index} />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

function mapStateToProps({ app }) {
  return { app };
}

IndexPage.propTypes = {
};

export default connect(mapStateToProps)(IndexPage);
