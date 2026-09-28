'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { identity, event } from '@sitecore-cloudsdk/events/browser';

interface ServiceAlertFormProps {
  articleTitle?: string;
}

export const ServiceAlertForm = ({ articleTitle }: ServiceAlertFormProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const [firstName, ...lastNameParts] = trimmedName.split(/\s+/);
    const lastName = lastNameParts.join(' ');

    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');

    identity({
      channel: 'WEB',
      language: 'EN',
      currency: 'AED',
      email: trimmedEmail,
      identifiers: [{ id: trimmedEmail, provider: 'email' }],
      ...(firstName ? { firstName } : {}),
      ...(lastName ? { lastName } : {}),
    }).catch((identityError) => console.debug(identityError));

    event({
      type: 'SERVICE_ALERT_SIGNUP',
      channel: 'WEB',
      language: 'EN',
      currency: 'AED',
      extensionData: {
        article: articleTitle || 'article',
        topic: 'service-alerts',
      },
    }).catch((eventError) => console.debug(eventError));

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFullName('');
    setEmail('');
  };

  return (
    <div className="service-alert-form">
      <h5 className="service-alert-form-title">
        <Bell />
        Service alerts
      </h5>
      {submitted ? (
        <p className="service-alert-form-success">
          You are signed up for TAQA service alerts. We will notify you about outages and account
          updates.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="service-alert-form-fields">
          <p className="service-alert-form-copy">
            Get outage, maintenance, and bill-ready alerts for your TAQA Distribution account.
          </p>
          <label className="service-alert-form-label" htmlFor="service-alert-name">
            Full name
            <input
              id="service-alert-name"
              type="text"
              value={fullName}
              onChange={(eventChange) => setFullName(eventChange.target.value)}
              placeholder="e.g. Omar Al Hashmi"
              autoComplete="name"
              className="service-alert-form-input"
            />
          </label>
          <label className="service-alert-form-label" htmlFor="service-alert-email">
            Email
            <input
              id="service-alert-email"
              type="email"
              value={email}
              onChange={(eventChange) => setEmail(eventChange.target.value)}
              placeholder="name@email.com"
              autoComplete="email"
              className="service-alert-form-input"
            />
          </label>
          {error && <p className="service-alert-form-error">{error}</p>}
          <button type="submit" className="main-btn service-alert-form-submit">
            Get service alerts
          </button>
        </form>
      )}
    </div>
  );
};
