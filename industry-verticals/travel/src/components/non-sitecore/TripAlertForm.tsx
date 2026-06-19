'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { identity, event } from '@sitecore-cloudsdk/events/browser';

const inputClass =
  'bg-background ring-foreground/20 focus:ring-foreground/40 !text-foreground placeholder:text-foreground/70 h-9 w-full rounded-md ps-3 ring-1 focus:ring-2 focus:outline-none';

export const TripAlertForm = ({ destinationName }: { destinationName: string }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('Please enter your first name.');
      return;
    }
    if (!lastName.trim()) {
      setError('Please enter your last name.');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');

    identity({
      channel: 'WEB',
      language: 'EN',
      currency: 'USD',
      email: email,
      identifiers: [{ id: email, provider: 'email' }],
      ...(firstName.trim() ? { firstName: firstName.trim() } : {}),
      ...(lastName.trim() ? { lastName: lastName.trim() } : {}),
    }).catch((e) => console.debug(e));

    event({
      type: 'PRICE_ALERT_SIGNUP',
      channel: 'WEB',
      language: 'EN',
      currency: 'USD',
      extensionData: { destination: destinationName },
    }).catch((e) => console.debug(e));

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFirstName('');
    setLastName('');
    setEmail('');
  };

  return (
    <div className="info-card">
      <h5 className="info-card-title">
        <Bell />
        Price Alerts
      </h5>
      {submitted ? (
        <p className="text-accent text-center font-semibold">We&apos;ll keep you posted ✓</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <p className="text-foreground-muted text-sm">
            Get notified when prices to {destinationName} drop.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className={inputClass}
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className={inputClass}
            />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={inputClass}
          />
          {error && <p className="text-destructive text-xs">{error}</p>}
          <button type="submit" className="btn-primary">
            Notify Me
          </button>
        </form>
      )}
    </div>
  );
};
