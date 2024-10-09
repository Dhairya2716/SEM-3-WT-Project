import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import About from './components/About';
import Home from './components/Home';
import Todo from './components/todo';

function App() {
  const headStyle = {
    textAlign: "center",
  };

  return (
    <BrowserRouter>
      <div>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg bg-danger">
          <div className="container-fluid">
            <Link className="navbar-brand" style={headStyle} to="/todo">Todo List</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" to="/home">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/About">About</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
        <Route  path='/' element={<Home />} />
          <Route  index path='/home' element={<Home />} />
          <Route path='/About' element={<About />} />
          <Route path='/todo' element={<Todo />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;