import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import AuthRequired from "./components/authRequired";

import Login from './pages/Login';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Settings from "./pages/Settings";
import Error from "./pages/Error";

function App() {
  return (
      <BrowserRouter>
          <Switch>
              <AuthRequired exact path="/" component={Home} />
              <AuthRequired exact path="/detail/:auctionId" component={Detail} />
              <AuthRequired exact path="/settings" component={Settings} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/error/:status?" component={Error}/>
              <Route path="/" component={Error}/>
          </Switch>
      </BrowserRouter>
  );
}
export default App;
