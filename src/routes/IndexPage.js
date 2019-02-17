import React, { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Layout, Row, Col, Card } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import { pieOption, barOption, rateOption } from '../utils/EchartsOptions';
import styles from './style.less';


class Index extends Component {
  constructor() {
    super();
    this.state = {

    };
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    console.log(this.pie.style.width);
    let pieChart = echarts.init(this.pie);
    let barChart = echarts.init(this.bar);
    let viewChart = echarts.init(this.line_1);
    let peopleChart = echarts.init(this.line_2);
    pieChart.setOption(pieOption);
    barChart.setOption(barOption);
    viewChart.setOption(rateOption);
    peopleChart.setOption(rateOption);
    window.onresize = function () {
      pieChart.resize();
      barChart.resize();
      viewChart.resize();
      peopleChart.resize();
    }
  }

  render() {
    return (
      <Layout className={styles.container}>
        <Row gutter="12">
          <Col span="12">
            <Card className={styles.countNum}>
              <h2>累计粉丝数/累计会员数</h2>
              <p>1239/19884</p>
            </Card>
          </Col>
          <Col span="12">
            <Card className={styles.countNum}>
              <h2>累计粉丝数/累计会员数</h2>
              <p>1239/19884</p>
            </Card>
          </Col>
        </Row>
        <Row gutter="12">
          <Col span="12">
            <Card>
              <div ref={pie => this.pie = pie} className={styles.charts}></div>
            </Card>
          </Col>
          <Col span="12">
            <Card>
              <div ref={bar => this.bar = bar} className={styles.charts}></div>
            </Card>
          </Col>
        </Row>
        <Row gutter="12">
          <Col span="12">
            <Card>
              <div ref={line_1 => this.line_1 = line_1} className={styles.charts}></div>
            </Card>
          </Col>
          <Col span="12">
            <Card>
              <div ref={line_2 => this.line_2 = line_2} className={styles.charts}></div>
            </Card>
          </Col>
        </Row>
        <Row gutter="12">
          <Col span="12">
            <Card className={styles.countNum}>
              <h2>总订单笔数</h2>
              <p>19884</p>
            </Card>
          </Col>
          <Col span="12">
            <Card className={styles.countNum}>
              <h2>昨日新增订单</h2>
              <p>19884</p>
            </Card>
          </Col>
        </Row>
      </Layout>
    );
  }
}

Index.propTypes = {
};

function mapStateToProps({ index }) {
  return {
    index
  };
}

export default connect(mapStateToProps)(Index);
