import { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Layout, Menu, Dropdown, Icon } from 'antd';
import config from '../../../utils/config';
import MenuList from '../../../utils/menus';
import styles from './style.less';

const { Header } = Layout;
const MenuItem = Menu.Item;
const menu = (
  <Menu>
    <Menu.Item key="0">
      <span>Cart</span>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="1">logout</Menu.Item>
  </Menu>
);

class HeaderLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { app: { selectedMenuArray } } = this.props;

    return (
      <Header className={styles.header}>
        <div className={styles.logo}>
          <Icon type="chrome" style={{ fontSize: '30px', color: '#fff', verticalAlign: 'middle', marginTop: '-5px' }} />
          {/* <img src={logo} alt={config.name} /> */}
          <h2 className={styles.title}>{config.name}</h2>
        </div>
        <Menu
          selectedKeys={[selectedMenuArray[0]]}
          mode="horizontal"
          theme="dark"
          className={styles.menu}
        >
          {
            MenuList.map(item => (
              <MenuItem key={item.key}>
                <Link to={item.path}>
                  <Icon type={item.icon} className={styles.icon} />
                  {item.name}
                </Link>
              </MenuItem>
            ))
          }
        </Menu>
        <div className={styles.userinfo}>
          <Dropdown overlay={menu} trigger={['click']} placement={'bottomCenter'}>
            <a href="javascript:">
              admin <Icon type="down" />
            </a>
          </Dropdown>
        </div>
      </Header>
    );
  }
}

HeaderLayout.propTypes = {
};

function mapStateToProps({ app }) {
  return { app };
}

export default connect(mapStateToProps)(HeaderLayout);
