'use client';

import React, { ChangeEvent, FormEvent, JSX, useState } from 'react';
import {
  Field,
  RichText as ContentSdkRichText,
  LinkField,
  Link,
} from '@sitecore-content-sdk/nextjs';
import { LoaderCircle } from 'lucide-react';
import { ComponentProps } from 'lib/component-props';
import { sendIdentityEvent } from '@/lib/datalayerhelper';

const REDIRECT_DELAY_MS = 800;

interface Fields {
  Link: LinkField;
  Email: Field<string>;
}

export type loginProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Fields;
};

export const testLoginAccounts = [
  {
    email: 'sami.errougui@gmail.com',
  },
  {
    email: 'hossam.medhat@gmail.com',
  },
  {
    email: 'pedro.pascal@gmail.com',
  },
  {
    email: 'ivy.george@gmail.com',
  },
];

export const Default = ({ params, fields }: loginProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

  const emailText = fields ? (
    <ContentSdkRichText field={fields.Email} />
  ) : (
    <span className="is-empty-hint">Email :</span>
  );

  // State to store form input values
  const [formData, setFormData] = useState({ email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Event handler for form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Event handler for form submission: send identity, brief delay so event can flush, then redirect
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sendIdentityEvent(formData.email);
      await new Promise((resolve) => setTimeout(resolve, REDIRECT_DELAY_MS));
      const href = fields.Link?.value?.href;
      if (href) {
        window.location.href = href;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className={`component login ${styles ?? ''}`}
      id={RenderingIdentifier}
      aria-labelledby="loginTitle"
    >
      <div className="login-shell">
        <h1 id="loginTitle" className="login-title">
          Enter your booking details
        </h1>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="login-form-group">
            <label htmlFor="email" className="login-label">
              {emailText}
            </label>

            <input
              list="emailList"
              type="email"
              id="email"
              name="email"
              className="login-input"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
            />

            <datalist id="emailList">
              {testLoginAccounts.map((item, index) => (
                <option value={item.email} key={index}></option>
              ))}
            </datalist>
          </div>

          {/* Booking number: static field, value is not used in the request */}
          <div className="login-form-group">
            <label htmlFor="bookingNumber" className="login-label">
              Booking number
            </label>
            <input
              type="text"
              id="bookingNumber"
              className="login-input"
              placeholder="Enter booking number"
              autoComplete="off"
            />
          </div>

          {/* Submit */}
          <div className="login-submit-row">
            <button
              className="login-button"
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="login-button-spinner" aria-hidden />
                  <span>Loading...</span>
                </>
              ) : (
                <Link field={fields.Link} />
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ---------- Styled-JSX: co-located CSS ---------- */}
      <style jsx>{`
        /* White section background with dark text */
        .component.login {
          background-color: #fff;
          color: #1a1a1a;
        }

        /* Centered container with narrow width similar to mock */
        .login-shell {
          max-width: 720px;
          margin: 0 auto;
          padding: 56px 20px 96px;
        }

        /* Large, lightweight title, centered */
        .login-title {
          margin: 0 0 32px;
          font-size: clamp(32px, 6vw, 64px);
          font-weight: 400;
          line-height: 1.1;
          text-align: center;
          color: #1a1a1a;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .login-form-group {
          display: flex;
          flex-direction: column;
        }

        /* Label styling */
        .login-label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #333;
        }

        /* Inputs: light background, dark text, visible border */
        .login-input {
          width: 100%;
          appearance: none;
          background-color: #fff;
          border: 1px solid #ccc;
          color: #1a1a1a;
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 16px;
          line-height: 1.3;
          outline: none;
          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease,
            background-color 0.15s ease;
        }
        .login-input::placeholder {
          color: #666;
        }
        .login-input:hover {
          border-color: rgba(0, 174, 239, 0.5);
        }
        .login-input:focus {
          border-color: #00aeef;
          box-shadow: 0 0 0 3px rgba(0, 174, 239, 0.25);
          background-color: #fff;
        }

        /* Submit row to create breathing space before CTA */
        .login-submit-row {
          margin-top: 12px;
        }

        /* Primary CTA: flynas teal accent to match header/footer */
        .login-button {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          background-color: #00b7ac;
          color: #fff;
          border: 1px solid #00b7ac;
          border-radius: 10px;

          padding: 14px 18px;
          font-size: 16px;
          font-weight: 500;
          line-height: 1;
          cursor: pointer;
          transition:
            background-color 0.15s ease,
            transform 0.03s ease,
            box-shadow 0.15s ease;
        }
        .login-button:hover {
          background-color: #00b7ac;
          border-color: #00b7ac;
        }
        .login-button:active {
          transform: translateY(1px);
        }
        .login-button:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 174, 239, 0.35);
        }
        .login-button:disabled {
          cursor: not-allowed;
          opacity: 0.85;
        }
        .login-button-spinner {
          width: 1.25rem;
          height: 1.25rem;
          animation: login-spin 0.8s linear infinite;
        }
        @keyframes login-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Datalist dropdown arrow visible on light background */
        :global(input[list])::-webkit-calendar-picker-indicator {
          opacity: 0.6;
        }

        /* Optional: hint style if Email field is empty in CMS */
        .is-empty-hint {
          color: #555;
          opacity: 0.9;
        }
      `}</style>
    </section>
  );
};
