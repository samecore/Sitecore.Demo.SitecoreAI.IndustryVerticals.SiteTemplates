'use client';

import { FormEvent, JSX, useEffect, useState } from 'react';
import {
  Field,
  LinkField,
  RichText,
  RichTextField,
  Text,
} from '@sitecore-content-sdk/nextjs';
import { event, identity } from '@sitecore-content-sdk/events';

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

const splitFullName = (fullName: string) => {
  const trimmed = fullName.trim();
  const spaceIndex = trimmed.indexOf(' ');
  if (spaceIndex === -1) {
    return { firstName: trimmed, lastName: '' };
  }
  return {
    firstName: trimmed.slice(0, spaceIndex).trim(),
    lastName: trimmed.slice(spaceIndex + 1).trim(),
  };
};

export const Default = (props: ApplicationFormProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const sxaStyles = `${props.params?.styles || ''}`;
  const submitLabel = props.fields?.SubmitButton?.value?.text || 'Submit';

  const [fullName, setFullName] = useState(String(props.fields?.FullName?.value ?? ''));
  const [idNumber, setIdNumber] = useState(String(props.fields?.IDNumber?.value ?? ''));
  const [email, setEmail] = useState(String(props.fields?.Email?.value ?? ''));
  const [mobileNumber, setMobileNumber] = useState(
    String(props.fields?.MobileNumber?.value ?? '')
  );
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

    if (!fullName.trim()) {
      setError('Please enter your first and last name.');
      return;
    }
    if (!idNumber.trim()) {
      setError('Please enter your ID number.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!mobileNumber.trim()) {
      setError('Please enter your mobile number.');
      return;
    }

    setError('');

    const { firstName, lastName } = splitFullName(fullName);

    // Resolve / enrich the guest profile in CDP
    identity({
      channel: 'WEB',
      language: 'EN',
      currency: 'USD',
      email: email.trim(),
      identifiers: [{ id: email.trim(), provider: 'email' }],
      ...(firstName ? { firstName } : {}),
      ...(lastName ? { lastName } : {}),
      ...(mobileNumber.trim() ? { phone: mobileNumber.trim() } : {}),
    }).catch((err) => console.debug(err));

    // Track the application submission as a custom event
    event({
      type: 'APPLICATION_FORM_SUBMIT',
      channel: 'WEB',
      language: 'EN',
      currency: 'USD',
      extensionData: {
        fullName: fullName.trim(),
        idNumber: idNumber.trim(),
        email: email.trim(),
        mobileNumber: mobileNumber.trim(),
      },
    }).catch((err) => console.debug(err));

    setShowSuccessPopup(true);
    setFullName('');
    setIdNumber('');
    setEmail('');
    setMobileNumber('');
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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="First and Last name"
              name="fullName"
              autoComplete="name"
            />
            <input
              className="input-field"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="ID number"
              name="idNumber"
              autoComplete="off"
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
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Mobile number"
              name="mobileNumber"
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
