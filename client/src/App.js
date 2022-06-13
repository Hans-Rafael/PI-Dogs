import './App.css';
import Dogs from './components/Dogs';
import Landing from './components/Landing';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Create from './components/Create/index';
import Detail from './components/Detail/index';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Landing}></Route>
          <Route exact path='/home' component={Dogs}></Route>
          <Route path='/home/:id' component={Detail}></Route>
          <Route path='/create' component={Create}></Route>
          <Route path='*' component={NotFound}></Route>
        </Switch>
      </BrowserRouter>

    </div>
  );
}
function NotFound() {
  return <><h1>You have landed on a page that doesn't exist</h1></>;
}

export default App;
