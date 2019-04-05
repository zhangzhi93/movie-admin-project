import { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Breadcrumb } from 'antd';
import { MenuList } from '../../utils/menus';

const BreadcrumbItem = Breadcrumb.Item;

class Breadcrumb extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getBreadcrumb = () => {
    const { app: { urlToMenu: { urlMenuArr } } } = this.props;
    let MenuItem = MenuList;
    this.getBreadcrumbItem(MenuList, urlMenuArr[0])
    urlMenuArr.map(item => {
      MenuItem = MenuList.find(list => list.key === item);
    })
  }

  getBreadcrumbItem = (list, level) => {
    const { app: { urlToMenu: { urlMenuArr } } } = this.props;
    if (level < urlMenuArr.length) {
      return (
        <BreadcrumbItem>
          {
            list.find(item => item.key === urlMenuArr[level]).name
          }
        </BreadcrumbItem>
      )
    }
  }

  render() {


    return (
      <Breadcrumb separator=">>">
        <BreadcrumbItem>{firstMenuObj.name}</BreadcrumbItem>
        <BreadcrumbItem>{secondMenuObj.name}</BreadcrumbItem>
      </Breadcrumb>
    );
  }
}

Breadcrumb.propTypes = {
};

function mapStateToProps({ app }) {
  return { app };
}

export default connect(mapStateToProps)(Breadcrumb);
