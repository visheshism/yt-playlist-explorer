import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router, Routes, Navigate, Route } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
     <Router>
          <Routes>
               <Route path={"/"} element={<App />} />
               <Route path={"*"} element={<Navigate to={"/"} />} />
          </Routes>
     </Router>
)