import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MovieDetail from "./pages/MovieDetail";
import Profile from "./pages/Profile";

export default function App() {
  return React.createElement(
    Router,
    null,
    React.createElement(Navbar),
    React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        Routes,
        null,
        React.createElement(Route, { path: "/", element: React.createElement(Home) }),
        React.createElement(Route, { path: "/login", element: React.createElement(Login) }),
        React.createElement(Route, { path: "/signup", element: React.createElement(Signup) }),
        React.createElement(Route, { path: "/movie/:id", element: React.createElement(MovieDetail) }),
        React.createElement(Route, { path: "/profile", element: React.createElement(Profile) })
      )
    )
  );
}