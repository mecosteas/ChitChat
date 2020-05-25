import React from 'react';

const navbar = ({ userName }) => {

    const factory = () => {
        if (!userName) {
            return (
                <nav className="navbar navbar-expand-lg navbar-collapse justify-content-end navbar-dark bg-dark ">
                    <a className="nav-link text-white" href="/">Home</a>
                    <a className="nav-link text-white" href="/login">Login</a>
                    <a className="nav-link text-white" href="/register">Register</a>
                </nav>
            )
        }

        else {
            return (
                <nav className="navbar navbar-expand-lg navbar-collapse justify-content-end navbar-dark bg-dark ">
                    <a className="nav-link text-white" href="/logout">Log Out</a>
                </nav>
            )
        }
    }

    return (
        <div>{factory()} </div>
    )
}

export default navbar; 