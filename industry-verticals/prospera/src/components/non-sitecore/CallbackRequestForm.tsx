'use client';

import { FormEvent, JSX, useState } from 'react';
import { event, identity } from '@sitecore-content-sdk/events';

export const CallbackRequestForm = ({ showIntro = false }: { showIntro?: boolean }): JSX.Element => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!firstName.trim()) {
      setError('Please enter your first name.');
      return;
    }
    if (!lastName.trim()) {
      setError('Please enter your last name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    setError('');

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phoneNumber.trim();

    identity({
      channel: 'WEB',
      language: 'EN',
      currency: 'USD',
      email: trimmedEmail,
      identifiers: [{ id: trimmedEmail, provider: 'email' }],
      ...(trimmedFirstName ? { firstName: trimmedFirstName } : {}),
      ...(trimmedLastName ? { lastName: trimmedLastName } : {}),
      ...(trimmedPhone ? { mobile: trimmedPhone } : {}),
    }).catch((err: unknown) => console.debug(err));

    event({
      type: 'CALLBACK_REQUEST',
      channel: 'WEB',
      language: 'EN',
      currency: 'USD',
      extensionData: {
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        email: trimmedEmail,
        phoneNumber: trimmedPhone,
      },
    }).catch((err: unknown) => console.debug(err));

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
  };

  return (
    <div className="callback-request-form">
      {showIntro && (
        <>
          <h2 className="callback-request-form-title">Request a callback</h2>
          <p className="callback-request-form-description">
            Leave your details and a Prospera agent will call you back at a time that suits you.
          </p>
        </>
      )}

      {!showIntro && <h2 className="callback-request-form-title">Request a callback</h2>}

      {submitted ? (
        <p className="callback-request-form-success">Thank you — we&apos;ll be in touch soon.</p>
      ) : (
        <form onSubmit={handleSubmit} className="callback-request-form-fields">
          <div className="callback-request-form-row">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              name="firstName"
              autoComplete="given-name"
              className="callback-request-form-input"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              name="lastName"
              autoComplete="family-name"
              className="callback-request-form-input"
            />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            name="email"
            autoComplete="email"
            className="callback-request-form-input"
          />
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone number"
            name="phoneNumber"
            autoComplete="tel"
            className="callback-request-form-input"
          />
          {error && <p className="callback-request-form-error">{error}</p>}
          <button type="submit" className="button button-main callback-request-form-submit">
            Request callback
          </button>
        </form>
      )}
    </div>
  );
};
