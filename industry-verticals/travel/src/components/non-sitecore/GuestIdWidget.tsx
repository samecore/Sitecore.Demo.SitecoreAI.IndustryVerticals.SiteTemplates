'use client';

import { useState, useEffect, useCallback } from 'react';
import { Copy, Check, UserCircle, RotateCcw, X, Loader2 } from 'lucide-react';

export const GuestIdWidget = () => {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    let mounted = true;
    let attempts = 0;

    const tryGetId = async () => {
      try {
        const { getGuestId } = await import('@sitecore-cloudsdk/core/browser');
        const id = await getGuestId();
        if (mounted) setProfileId(id);
      } catch {
        attempts++;
        if (mounted && attempts < 8) {
          setTimeout(tryGetId, 1500);
        }
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
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2">
      {expanded && (
        <div className="bg-background border-border w-64 rounded-lg border shadow-lg">
          {/* Header */}
          <div className="border-border flex items-center justify-between border-b px-3 py-2">
            <span className="text-foreground/50 text-xs font-medium tracking-wider uppercase">
              Sitecore AI Profile
            </span>
            <button
              onClick={() => setExpanded(false)}
              className="text-foreground/40 hover:text-foreground transition-colors"
              title="Close"
            >
              <X size={14} />
            </button>
          </div>

          {/* ID + copy */}
          <div className="flex items-center gap-2 px-3 py-2.5">
            <span
              className="text-foreground/80 min-w-0 flex-1 truncate font-mono text-xs select-all"
              title={profileId}
            >
              {profileId}
            </span>
            <button
              onClick={handleCopy}
              className="text-foreground/50 hover:text-foreground shrink-0 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
            </button>
          </div>

          {/* Actions */}
          <div className="border-border border-t px-2 py-2">
            <button
              onClick={handleReset}
              disabled={resetting}
              className="text-foreground/60 hover:text-foreground hover:bg-background-muted flex w-full items-center justify-center gap-1.5 rounded px-2 py-1.5 text-xs transition-colors disabled:opacity-50"
              title="Clear session cookies and reload as a new anonymous profile"
            >
              {resetting ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
              Restart as anonymous
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="bg-background/80 border-border text-foreground/60 hover:text-foreground hover:bg-background flex size-8 items-center justify-center rounded-full border shadow-md backdrop-blur-sm transition-all"
        title="Profile ID"
      >
        <UserCircle size={16} />
      </button>
    </div>
  );
};
