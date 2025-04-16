import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuoteList = () => {
  const [quotes, setQuotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5050/api/quotes')
      .then(res => res.json())
      .then(data => {
        console.log('💡 Quote list loaded:', data);
        setQuotes(data);
      })
      .catch(err => console.error('❌ Error loading quotes:', err));
  }, []);  

  const deleteQuote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quote?')) return;

    try {
      const response = await fetch(`http://localhost:5050/api/quotes/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (response.ok) {
        alert('🗑️ Quote deleted');
        setQuotes(quotes.filter(q => q._id !== id));
      } else {
        console.error('Delete failed:', data);
        alert('❌ Could not delete quote');
      }
    } catch (err) {
      console.error('❌ Delete error:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="container">
      <h2>📋 Quote History</h2>
      {quotes.length === 0 ? (
        <p>No quotes found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Quote Title</th>
              <th>Reference</th>
              <th>Price (SEK)</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map(quote => (
              <tr key={quote._id}>
                <td>{quote.customerName || 'No customer'}</td>
                <td>{quote.title}</td>
                <td>{quote.reference}</td>
                <td>{quote.predictedPrice !== undefined ? `${quote.predictedPrice} SEK` : 'No price'}</td>
                <td>{new Date(quote.validUntil).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => navigate(`/quotes/${quote._id}`)}>View</button>
                  <button onClick={() => deleteQuote(quote._id)} style={{ marginLeft: '10px' }}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuoteList;
