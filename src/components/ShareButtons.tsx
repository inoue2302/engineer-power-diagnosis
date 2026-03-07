"use client";

import type { DiagnosisResult } from "@/types/diagnosis";

type ShareButtonsProps = {
  result: DiagnosisResult;
  onSaveImage?: () => void;
};

const generateShareText = (result: DiagnosisResult) => {
  const emoji = result.powerLevel >= 8000 ? "🔥" : result.powerLevel >= 6000 ? "⚡" : result.powerLevel >= 3000 ? "💪" : "👊";
  return `俺の技術戦闘力は${result.powerLevel.toLocaleString()}だった…${result.rank}らしい${emoji}\n\n#エンジニア戦闘力診断`;
};

const getShareUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "";
};

export const ShareButtons = ({ result, onSaveImage }: ShareButtonsProps) => {
  const text = generateShareText(result);
  const url = getShareUrl();

  const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const hatenaUrl = `https://b.hatena.ne.jp/entry/panel/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;

  return (
    <div className="space-y-3">
      <p className="font-dot text-[10px] text-[var(--energy-amber)] tracking-wider text-center">
        SHARE RESULT
      </p>
      <div className="flex justify-center gap-3">
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.05)] px-5 py-2.5 text-sm text-[var(--foreground)] transition-all hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)]"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Post</span>
        </a>
        <a
          href={hatenaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.05)] px-5 py-2.5 text-sm text-[var(--foreground)] transition-all hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)]"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
            <path d="M20.47 2H3.53A1.45 1.45 0 002 3.38v17.24A1.45 1.45 0 003.53 22h16.94A1.45 1.45 0 0022 20.62V3.38A1.45 1.45 0 0020.47 2zM8.61 17.12c0 .56-.47.88-1.4.88H6.18c-.87 0-1.34-.32-1.34-.88V6.88c0-.56.47-.88 1.34-.88H7.2c.93 0 1.4.32 1.4.88v10.24zm10.06-.15c0 .56-.42.91-1.27.91h-1.07c-.85 0-1.27-.35-1.27-.91v-4.14l-2.56 4.57c-.3.5-.64.67-1.16.48-.37-.14-.55-.42-.55-.83V6.88c0-.56.42-.88 1.27-.88h1.07c.85 0 1.27.32 1.27.88v4.1l2.56-4.5c.3-.5.64-.67 1.16-.48.37.14.55.42.55.83v10.14z" />
          </svg>
          <span>Bookmark</span>
        </a>
        {onSaveImage && (
          <button
            type="button"
            onClick={onSaveImage}
            className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.05)] px-5 py-2.5 text-sm text-[var(--foreground)] transition-all hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)] cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>画像を保存</span>
          </button>
        )}
      </div>
    </div>
  );
};
