'use client';

import { FormEvent, JSX, useEffect, useState } from 'react';
import {
  Field,
  LinkField,
  RichText,
  RichTextField,
  Text,
} from '@sitecore-content-sdk/nextjs';
import { event } from '@sitecore-content-sdk/events';
import { getLoanCalculatorSnapshot } from 'lib/loan-calculator-store';

interface Fields {
  Title: Field<string>;
  Subtitle: RichTextField;
  FullName: Field<string>;
  IDNumber: Field<string>;
  Email: Field<string>;
  MobileNumber: Field<number>;
  Footnote: RichTextField;
  SubmitButton: LinkField;
}

export type ApplicationFormProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: ApplicationFormProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const sxaStyles = `${props.params?.styles || ''}`;
  const submitLabel = props.fields?.SubmitButton?.value?.text || 'Submit';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const closeSuccessPopup = () => setShowSuccessPopup(false);

  useEffect(() => {
    if (!showSuccessPopup) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSuccessPopup(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSuccessPopup]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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
    const loanDetails = getLoanCalculatorSnapshot();

    event({
      type: 'LOAN_APPLICATION',
      channel: 'WEB',
      language: 'EN',
      currency: 'USD',
      extensionData: {
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        email: trimmedEmail,
        phoneNumber: trimmedPhone,
        ...(loanDetails ? { loanCalculator: loanDetails } : {}),
      },
    }).catch((err) => console.debug(err));

    setShowSuccessPopup(true);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
  };

  return (
    <div className={`component application-form ${sxaStyles}`} id={id ? id : undefined}>
      <div className="application-form-inner">
        <div className="container">
          <div className="title">
            <Text field={props.fields?.Title} />
          </div>
          <div className="subtitle">
            <RichText field={props.fields?.Subtitle} />
          </div>

          <form onSubmit={handleSubmit}>
            <input
              className="input-field"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              name="firstName"
              autoComplete="given-name"
            />
            <input
              className="input-field"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              name="lastName"
              autoComplete="family-name"
            />
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              name="email"
              autoComplete="email"
            />
            <input
              className="input-field"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone number"
              name="phoneNumber"
              autoComplete="tel"
            />
            <div className="footnote">
              <RichText field={props.fields?.Footnote} />
            </div>
            {error && <p className="application-form-error">{error}</p>}
            <button type="submit" className="button button-main submit-button">
              {submitLabel}
            </button>
          </form>
        </div>
      </div>

      {showSuccessPopup && (
        <div
          className="application-form-popup-overlay"
          onClick={closeSuccessPopup}
          role="presentation"
        >
          <div
            className="application-form-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-form-popup-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="application-form-popup-title" className="application-form-popup-title">
              We have received your loan request
            </h3>
            <p className="application-form-popup-message">We&apos;ll get back to you soon.</p>
            <button
              type="button"
              className="button button-main application-form-popup-close"
              onClick={closeSuccessPopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
