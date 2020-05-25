import React from 'react';
import './App.css';
import ChatControls from './components/chatControls';
import Registration from './components/registration';
import Login from './components/login';
import Home from './components/home';
import Navbar from './components/navbar';
import { Switch, Route, Link } from 'react-router-dom';
import ChatWindow from './components/chatWindow';

const ws = new WebSocket('ws://localhost:1235/ws');
ws.onopen = () => console.log('Connection OPEN.');
ws.onclose = () => console.log('Connection CLOSED.');

const App = ({ }) => {
  const [userName, setUsername] = React.useState('');
  console.log("Username in app: ", userName);
  return (
    <React.Fragment>
      <Navbar userName={userName} />

      <Switch>
        <Route path="/login">
          <Login userName={userName} setUsername={setUsername} />
        </Route>

        <Route path="/register">
          <Registration userName={userName} setUsername={setUsername} />
        </Route>

        <Route path="/chatcontrol">
          <ChatControls ws={ws} userName={userName} />
          <ChatWindow ws={ws} userName={userName} />
        </Route>

        <Route path="/">
          <Home />
        </Route>
      </Switch>

    </React.Fragment>
  );
}

export default App;
