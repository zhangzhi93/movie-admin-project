import { Router, Route, Switch } from 'dva/router';
import Main from './routes/Main';
import Login from './routes/Login';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/" component={Main} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
