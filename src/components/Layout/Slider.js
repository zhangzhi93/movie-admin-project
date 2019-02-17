import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Layout, Menu } from 'antd';
import { MenuList } from '../../utils/menus.js';
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

  renderMenuItem = (MenuList) => {
    return MenuList.map((item, index) => {
      if (item.MenuList && item.MenuList.length > 0) {
        return (
          <SubMenu key={item.key} title={item.name}>{this.renderMenuItem(item.MenuList)}</SubMenu >
        )
      } else {
        return (
          <MenuItem key={item.key}>
            {
              item.type === '1' ?
                <Link to={item.path}>{item.name}</Link>
                : <span>{item.name}</span>
            }
          </MenuItem>
        )
      }
    })
  }

  render() {
    let { app: { firstMenuKey, secondMenuKey } } = this.props;
    firstMenuKey = firstMenuKey ? firstMenuKey : 'Index';
    const subMenu = MenuList.find(item => item.key === firstMenuKey);
    const itemKey = secondMenuKey ? secondMenuKey : subMenu.MenuList[0].key;

    return (
      <Sider width={200} className={styles.slider}>
        <Menu
          theme='light'
          defaultOpenKeys={['sub1']}
          selectedKeys={[itemKey]}
          mode="inline"
          style={{ borderRight: '1px solid #fff' }}
        >
          {
            this.renderMenuItem(subMenu.MenuList)
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
