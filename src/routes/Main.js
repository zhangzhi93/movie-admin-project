import React from 'react';
import { connect } from 'dva';
import { Route } from 'dva/router';
import { Layout, Breadcrumb } from 'antd';
import styles from './style.less';
import Header from '../components/Layout/Header';
import Slider from '../components/Layout/Slider';
import Index from './IndexPage';
import StoreList from './StoreManage/StoreList';
import StoreEdit from './StoreManage/StoreEdit';
import UserList from './Member/UserList/Index';

const { Content } = Layout;
const BreadcrumbItem = Breadcrumb.Item;

function IndexPage({ children, app }) {

  const { urltomenu: { firstMenuObj, secondMenuObj } } = app;

  return (
    <Layout>
      <Header />
      <Layout>
        <Slider />
        <Layout className={styles.Main}>
          <Breadcrumb separator=">>">
            <BreadcrumbItem>{firstMenuObj.name}</BreadcrumbItem>
            <BreadcrumbItem>{secondMenuObj.name}</BreadcrumbItem>
          </Breadcrumb>
          <Content>
            <Route path="/" exact component={Index} />
            <Route path="/Index/Home" exact component={Index} />
            <Route path="/StoreManage/Store" exact component={StoreList} />
            <Route path="/StoreManage/Store/view" exact component={StoreList} />
            <Route path="/StoreManage/edit/:id" exact component={StoreEdit} />
            <Route path="/Member/UserList" exact component={UserList} />
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
