import './App.css';


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuoteForm from './components/QuoteForm';
import QuoteList from './components/QuoteList';
import QuoteDetail from './components/QuoteDetail';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <h1>AI Quote Generator</h1>
        <Routes>
          <Route path="/" element={<QuoteForm />} />
          <Route path="/quotes" element={<QuoteList />} />
          <Route path="/quotes/:id" element={<QuoteDetail />} />
        </Routes>
          <nav style={{ marginBottom: '20px' }}>
          <a href="/" style={{ marginRight: '10px' }}>➕ Create Quote</a>
          <a href="/quotes">📋 Quote History</a>
        </nav>

      </div>
    </Router>
  );
}

export default App;
