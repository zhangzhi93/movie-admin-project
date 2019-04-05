import React from 'react';
import { connect } from 'dva';
import { Route, Switch, Redirect } from 'dva/router';
import { Layout, Breadcrumb } from 'antd';
import styles from './style.less';
import Header from '../components/Layout/Header';
import Slider from '../components/Layout/Slider';
import Index from './IndexPage';
import StoreList from './StoreManage/StoreList';
import StoreEdit from './StoreManage/StoreEdit';
import UserList from './Member/UserList';
import OrderList from './Member/Order';
import GroupList from './Member/Group';
import ImageText from './Tweets/ImageText';
import Picture from './Tweets/Picture';
import TypesList from './Tweets/Types';

const { Content } = Layout;
const BreadcrumbItem = Breadcrumb.Item;

function IndexPage({ children, app }) {

  //const { urlToMenu: { firstMenuObj, secondMenuObj } } = app;

  return (
    <Layout>
      <Header />
      <Layout>
        <Slider />
        <Layout className={styles.Main}>
          {/* <Breadcrumb separator=">>">
            <BreadcrumbItem>{firstMenuObj.name}</BreadcrumbItem>
            <BreadcrumbItem>{secondMenuObj.name}</BreadcrumbItem>
          </Breadcrumb> */}
          <Content>
            <Switch>
              <Redirect exact from="/" to="/Index/Home" />
              <Redirect exact from="/Index" to="/Index/Home" />
              <Route path="/Index/Home" exact component={Index} />
              <Redirect exact from="/StoreManage" to="/StoreManage/Store" />
              <Route path="/StoreManage/Store" exact component={StoreList} />
              <Route path="/StoreManage/Store/view" exact component={StoreList} />
              <Route path="/StoreManage/Store/edit/:id" exact component={StoreEdit} />
              <Redirect exact from="/Member" to="/Member/UserList" />
              <Route path="/Member/UserList" exact component={UserList} />
              <Route path="/Member/OrderList" exact component={OrderList} />
              <Route path="/Member/GroupList" exact component={GroupList} />
              <Redirect exact from="/Tweets" to="/Tweets/ImageText" />
              <Route path="/Tweets/ImageText" exact component={ImageText} />
              <Route path="/Tweets/Picture" exact component={Picture} />
              <Route path="/Tweets/TypesList" exact component={TypesList} />
            </Switch>
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
