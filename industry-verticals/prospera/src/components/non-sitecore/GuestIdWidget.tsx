'use client';

import { useState, useEffect, useCallback } from 'react';
import { getClientId } from '@sitecore-content-sdk/analytics-core';

const getClientIdFromCookie = (): string | null => {
  const match = document.cookie.match(/(?:^|;\s*)sc_cid=([^;]+)/);
  return match?.[1] ?? null;
};

const tryResolveClientId = (): string | null => {
  try {
    const id = getClientId();
    if (id) {
      return id;
    }
  } catch {
    // Analytics plugin may not be initialized yet (e.g. in development).
  }

  return getClientIdFromCookie();
};

export const GuestIdWidget = () => {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    let mounted = true;
    let attempts = 0;

    const tryGetId = () => {
      const id = tryResolveClientId();
      if (id) {
        if (mounted) setProfileId(id);
        return;
      }

      attempts++;
      if (mounted && attempts < 8) {
        setTimeout(tryGetId, 1500);
      }
    };

    const timer = setTimeout(tryGetId, 1500);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    if (!profileId) return;
    await navigator.clipboard.writeText(profileId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [profileId]);

  const handleReset = useCallback(() => {
    setResetting(true);
    document.cookie
      .split(';')
      .filter((c) => c.trim().startsWith('sc_'))
      .forEach((c) => {
        document.cookie =
          c.split('=')[0].trim() + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      });
    setTimeout(() => window.location.reload(), 600);
  }, []);

  if (!profileId) return null;

  return (
    <div className="guest-id-widget">
      {expanded && (
        <div className="guest-id-widget-panel">
          <div className="guest-id-widget-header">
            <span className="guest-id-widget-label">Sitecore AI Profile</span>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="guest-id-widget-icon-button"
              title="Close"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="guest-id-widget-body">
            <span className="guest-id-widget-id" title={profileId}>
              {profileId}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="guest-id-widget-icon-button"
              title="Copy to clipboard"
              aria-label="Copy to clipboard"
            >
              {copied ? '✓' : '⎘'}
            </button>
          </div>

          <div className="guest-id-widget-actions">
            <button
              type="button"
              onClick={handleReset}
              disabled={resetting}
              className="guest-id-widget-reset"
              title="Clear session cookies and reload as a new anonymous profile"
            >
              {resetting ? '…' : '↺'} Restart as anonymous
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="guest-id-widget-toggle"
        title="Profile ID"
        aria-label="Profile ID"
      >
        ◉
      </button>

      <style jsx>{`
        .guest-id-widget {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          z-index: 1050;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .guest-id-widget-panel {
          width: 16rem;
          border-radius: var(--roundness, 1rem);
          border: 1px solid rgba(3, 76, 129, 0.15);
          background: #fff;
          box-shadow: 0 12px 40px rgba(3, 24, 39, 0.15);
          overflow: hidden;
        }

        .guest-id-widget-header,
        .guest-id-widget-body,
        .guest-id-widget-actions {
          padding: 0.75rem;
        }

        .guest-id-widget-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(3, 76, 129, 0.1);
        }

        .guest-id-widget-label {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #707070;
        }

        .guest-id-widget-body {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .guest-id-widget-id {
          min-width: 0;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: monospace;
          font-size: 0.75rem;
          color: #034c81;
          user-select: all;
        }

        .guest-id-widget-actions {
          border-top: 1px solid rgba(3, 76, 129, 0.1);
        }

        .guest-id-widget-reset {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          border: none;
          border-radius: calc(var(--roundness, 1rem) / 2);
          background: transparent;
          padding: 0.5rem;
          font-size: 0.75rem;
          color: #707070;
          cursor: pointer;
        }

        .guest-id-widget-reset:hover:not(:disabled) {
          background: var(--bg-main-alt, #f0f5f7);
          color: #034c81;
        }

        .guest-id-widget-reset:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .guest-id-widget-icon-button,
        .guest-id-widget-toggle {
          border: 1px solid rgba(3, 76, 129, 0.15);
          background: rgba(255, 255, 255, 0.9);
          color: #034c81;
          cursor: pointer;
        }

        .guest-id-widget-icon-button {
          border: none;
          background: transparent;
          padding: 0;
          font-size: 1rem;
          line-height: 1;
        }

        .guest-id-widget-toggle {
          display: flex;
          width: 2rem;
          height: 2rem;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          box-shadow: 0 4px 16px rgba(3, 24, 39, 0.15);
          backdrop-filter: blur(4px);
        }

        .guest-id-widget-toggle:hover {
          background: #fff;
        }
      `}</style>
    </div>
  );
};
