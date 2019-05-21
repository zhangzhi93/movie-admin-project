import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Layout, Menu, Icon } from 'antd';
import MenuList from '../../../utils/menus';
import styles from './style.less'

const { Sider } = Layout;
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

class SliderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: false,
    }
  }

  onCollapse = (collapsed) => {
    this.setState({ isCollapsed: collapsed });
  }

  getMenuList = (menu) => {
    return menu.map(item => this.getSubMenuOrItem(item))
  }

  getSubMenuOrItem = (item, path) => {
    const fullPath = (path || '') + item.path;
    if (item.children && item.children.length !== 0) {
      return (
        <SubMenu key={item.key}
          title={
            <span>
              <Icon type={item.icon} />
              <span>{item.name}</span>
            </span>
          }
        >
          {item.children.map(child => this.getSubMenuOrItem(child, fullPath))}
        </SubMenu>
      )
    } else {
      return (
        <MenuItem key={item.key}>
          <Link to={(path || '') + item.path}>
            <Icon type={item.icon} />
            <span>{item.name}</span>
          </Link>
        </MenuItem>
      )
    }
  };


  render() {
    const { isCollapsed } = this.state;
    const { app: { selectedMenuArray } } = this.props;
    const openKeys = [...selectedMenuArray];
    const topKey = openKeys.shift();
    const subMenu = MenuList.find(item => item.key === topKey) || { children: [] };
    const selectedKey = openKeys.pop();
    return (
      <Sider
        collapsible={false}
        collapsed={isCollapsed}
        onCollapse={this.onCollapse}
        width={200}
        theme="light"
        className={styles.sliderMenu}
      >
        <Menu
          defaultSelectedKeys={[selectedKey]}
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          openKeys={openKeys}
          mode="inline"
          inlineCollapsed={isCollapsed}
        >
          {this.getMenuList(subMenu.children)}
        </Menu>
      </Sider>
    )
  }
}

SliderMenu.propTypes = {
};

function mapStateToProps({ app }) {
  return { app };
}

export default connect(mapStateToProps)(SliderMenu);
