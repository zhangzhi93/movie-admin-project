import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Layout, Menu, Icon } from 'antd';
import styles from './Slider.less';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: '1',
    }
  }

  getSubMenuOrItem = (item, path) => {
    const fullPath = (path || '') + item.path;
    if (item.MenuList && item.MenuList.length !== 0) {
      return (
        <SubMenu key={item.key}
          title={
            <span>
              {
                item.icon ? <Icon type={item.icon} /> : null
              }
              <span>{item.name}</span>
            </span>
          }
        >
          {item.MenuList.map(child => this.getSubMenuOrItem(child, fullPath))}
        </SubMenu>
      )
    } else {
      return (
        <MenuItem key={item.key}>
          <Link to={fullPath}>
            {
              item.icon ? <Icon type={item.icon} /> : null
            }
            <span>{item.name}</span>
          </Link>
        </MenuItem>
      )
    }
  };

  render() {
    const { app: { urlToMenu: { urlMenuArr, MenuItem } } } = this.props;
    const MenuList = [...urlMenuArr];
    const selectedKeys = MenuList.pop();
    MenuList.shift();
    const openKeys = MenuList;
    return (
      <Sider width={200} className={styles.slider}>
        <Menu
          theme='light'
          defaultOpenKeys={openKeys}
          selectedKeys={[selectedKeys]}
          mode="inline"
          style={{ borderRight: '1px solid #fff' }}
        >
          {
            MenuItem.MenuList.map(child => this.getSubMenuOrItem(child, '/' + urlMenuArr[0]))
          }
        </Menu>
      </Sider>
    );
  }
}

Slider.propTypes = {
};

function mapStateToProps({ app }) {
  return { app };
}

export default connect(mapStateToProps)(Slider);
