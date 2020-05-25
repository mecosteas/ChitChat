import React from 'react';
const home = () => {
  return (
      <center>
      <br/>
      <h1>Welcome to Team Bowser's Chat Application</h1>
      <br/>
      <div>
        <h3>If it is your first time here please register by clicking <a href='/register'>here</a></h3>
        <h3>If you are a returning user click <a href="/login">here</a> to start chatting</h3>
      </div>
      </center>
  );
};

export default home;