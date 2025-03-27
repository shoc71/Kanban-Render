import React, { useState } from 'react';
import "../styles/ContactMePage.css"

const ContactMePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/mjkgajnj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setResponseMessage('Your message has been sent!');
      } else {
        setResponseMessage('Failed to send the message.');
      }
    } catch (error) {
      setResponseMessage('An Error occurred:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5 min-vh-100">
      <h2 className="text-center mb-4 display-4">Contact Me</h2>

      <form onSubmit={handleSubmit} className="mx-auto contact-me-page" style={{ maxWidth: '1000px' }}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label lead">Your Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label lead">Your Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="message" className="form-label lead">Your Message</label>
          <textarea
            className="form-control"
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {responseMessage && <div className="alert alert-info">{responseMessage}</div>}

        <button type="submit" className="btn btn-success btn-lg custom-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactMePage;