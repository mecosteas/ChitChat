import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

const Login = ({ userName, setUsername }) => {
  const [newUsername, setNewUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');


  const handleAuth = (e) => {
    e.preventDefault();
    const body = {
      newUsername: newUsername,
      password: password
    };

    axios
      .post("/api/authenticate", body)
      .then((res) => {
        if (res.data.success) {
          setError("Success!")
          setUsername(newUsername);
        } else {
          setError(res.data.error);
        }
      })
      .catch(() => {
        setError("Failed to authenticate");
      });
  };

  if (userName) {
    return <Redirect to={"/chatcontrol"} />
  }

  return (
    <React.Fragment>
      <form onSubmit={handleAuth} className="login">
        <center>
          <h1>Login</h1>
        </center>
        <div className="inputBox">
          <div>
            Username
          <input
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              autoFocus={true}
            />
          </div>

          <div>
            Password
          <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <center>
          <div>
            <button type="submit" className="text" disabled={!newUsername || !password} onClick={handleAuth}>
              Login
          </button>
          </div>
          <div>{error && <strong>{error}</strong>}</div>
        </center>
      </form>
    </React.Fragment>
  );
};
export default Login;