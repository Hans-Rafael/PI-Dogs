import './App.css';
import Dogs from './components/Dogs';
import Landing from './components/Landing';
import { BrowserRouter, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <h1>Henry Dogs</h1>
      <BrowserRouter>
      <Route exact path='/' component={Landing}></Route>
      <Route exact path='/home' component={Dogs}></Route>
      </BrowserRouter>
      {/* <Dogs/> */}
    </div>
  );
}

export default App;
