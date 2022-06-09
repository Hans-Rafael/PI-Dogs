import './App.css';
import Dogs from './components/Dogs';
import Landing from './components/Landing';
import { BrowserRouter, Route } from 'react-router-dom';
import SearchBar from './components/Dogs/SearchBar/index';

function App() {
  return (
    <div className="App">
      <h1>Henry Dogs o lugar de a navbar</h1>
     {/*  <SearchBar/> */}
      <BrowserRouter>
      <h1>navbar</h1>
      <Route exact path='/' component={Landing}></Route>
      <Route exact path='/home' component={Dogs}></Route>
      {/* <Route path = '/dogs/:id' component={SearchBar}></Route> */}
      </BrowserRouter>
      
    </div>
  );
}

export default App;
