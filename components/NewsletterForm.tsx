"use client";

import { useState } from 'react';

export default function NewsletterForm({
  title,
  text,
  contactEmail,
}: {
  title: string;
  text: string;
  contactEmail: string;
}) {
  const [email, setEmail] = useState('');

  function submit(event: React.FormEvent) {
    event.preventDefault();

    const cleaned = email.trim();
    const subject = encodeURIComponent('Newsletter subscription');
    const body = encodeURIComponent(
      cleaned
        ? `Hello, I would like to subscribe to the newsletter with this email: ${cleaned}`
        : 'Hello, I would like to subscribe to the newsletter.'
    );

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  }

  return (
    <section className="newsletter-block">
      <div className="newsletter-inner">
        <h2>{title}</h2>
        <p>{text}</p>

        <form onSubmit={submit} className="newsletter-form">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            aria-label="Email"
            required
          />
          <button type="submit" aria-label="Subscribe to newsletter">
            →
          </button>
        </form>
      </div>
    </section>
  );
}
