import React from "react";
import { Link } from "react-router-dom";
import backgroundVideo from './background.mp4';
import './homepage.css';

function Home() {
    return (
        <div className="home-container">
            <video autoPlay loop muted className="background-video">
                <source src={backgroundVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            
            <div className="content">
                <h1>Welcome to the Todo App</h1>
                <p>Organize your tasks effectively!</p>
                <Link to="/todo" className="get-started-btn">Get Started</Link>
            </div>
        </div>
    );
}

export default Home;
