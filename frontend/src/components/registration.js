import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const Registration = ({ userName, setUsername }) => {
    const [newUsername, setNewUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState('')

    const register = (e) => {
        e.preventDefault();

        const body = {
            newUsername: newUsername,
            password: password
        }

        axios.post('/api/register', body)
            .then((res) => {
                if (res.data.success) {
                    console.log("Registered successfully")
                    setUsername(newUsername)
                } else {
                    setError(res.data.error);
                }
            })
            .catch(() => {
                setError('Failed to register')
            });
    }

    if (userName) {
        return <Redirect to={"/chatcontrol"} />
    }

    return (
        <React.Fragment>
            <form className="login" onSubmit={register}>
                <center>
                    <h1>Registration</h1>
                </center>
                <div className="inputBox">
                    <div>
                        Username
                        <input
                            value={newUsername}
                            onChange={e => setNewUsername(e.target.value)}
                            autoFocus={true}
                        />
                    </div>
                    <div>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <center>
                    <div>
                        <button className="text" type="submit" onClick={register}>Register</button>
                    </div>
                    {error && <strong>{error}</strong>}
                </center>
            </form>
        </React.Fragment>
    )
}
export default Registration;