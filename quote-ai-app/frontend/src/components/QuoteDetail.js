import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';

const QuoteDetail = () => {
  const { id } = useParams();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5050/api/quotes/${id}`)
      .then(res => res.json())
      .then(data => {
        setQuote(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading quote:', err);
        setLoading(false);
      });
  }, [id]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Quote Title: ${quote.title}`, 10, 10);
    doc.text(`Customer: ${quote.customerName || 'N/A'}`, 10, 20);
    doc.text(`Contact: ${quote.contact || 'N/A'}`, 10, 30);
    doc.text(`Valid Until: ${new Date(quote.validUntil).toLocaleDateString()}`, 10, 40);
    doc.text(`Predicted Price: ${quote.predictedPrice || 0} SEK`, 10, 50);

    const quoteLines = doc.splitTextToSize(quote.generatedQuoteText || '', 180);
    doc.text(quoteLines, 10, 60);

    doc.save(`Quote_${quote.title || 'Generated'}.pdf`);
  };

  const sendEmail = async () => {
    setSending(true);
    try {
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text(`Quote Title: ${quote.title}`, 10, 10);
      doc.text(`Customer: ${quote.customerName || 'N/A'}`, 10, 20);
      doc.text(`Valid Until: ${new Date(quote.validUntil).toLocaleDateString()}`, 10, 30);
      doc.text(`Predicted Price: ${quote.predictedPrice || 0} SEK`, 10, 40);
      const lines = doc.splitTextToSize(quote.generatedQuoteText || '', 180);
      doc.text(lines, 10, 50);

      const pdfBase64 = doc.output('datauristring');

      const response = await fetch('http://localhost:5050/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: quote.email || 'test@example.com', // ✅ use saved customer email
          subject: `Quote: ${quote.title}`,
          text: quote.generatedQuoteText,
          pdfBase64,
          filename: `Quote_${quote.title || 'Generated'}.pdf`
        })
      });

      if (response.ok) {
        alert('📧 Email sent!');
      } else {
        const err = await response.json();
        console.error('❌ Email error:', err);
        alert('❌ Email failed');
      }
    } catch (err) {
      console.error('❌ Send email error:', err);
      alert('Something went wrong while sending email.');
    }
    setSending(false);
  };

  if (loading) return <p>Loading...</p>;
  if (!quote) return <p>Quote not found.</p>;

  return (
    <div className="container">
      <h2>📄 Quote Details</h2>
      <p><strong>Title:</strong> {quote.title}</p>
      <p><strong>Customer:</strong> {quote.customerName || 'N/A'}</p>
      <p><strong>Contact:</strong> {quote.contact || 'N/A'}</p>
      <p><strong>Email:</strong> {quote.email || 'N/A'}</p>
      <p><strong>Reference:</strong> {quote.reference}</p>
      <p><strong>Valid Until:</strong> {new Date(quote.validUntil).toLocaleDateString()}</p>
      <p><strong>Predicted Price:</strong> {quote.predictedPrice || 0} SEK</p>

      <h4>📝 Generated Quote Text:</h4>
      <pre style={{ background: '#f4f4f4', padding: '10px' }}>{quote.generatedQuoteText || 'No text'}</pre>

      <div style={{ marginTop: '20px' }}>
        <button onClick={downloadPDF}>📄 Download PDF</button>
        <button onClick={sendEmail} style={{ marginLeft: '10px' }} disabled={sending}>
          {sending ? 'Sending...' : '📧 Send via Email'}
        </button>
      </div>
    </div>
  );
};

export default QuoteDetail;
