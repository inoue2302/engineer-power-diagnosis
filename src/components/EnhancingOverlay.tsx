"use client";

type EnhancingOverlayProps = {
  visible: boolean;
};

export const EnhancingOverlay = ({ visible }: EnhancingOverlayProps) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(0,0,0,0.6)] backdrop-blur-sm">
      <div className="text-center space-y-4 animate-pulse">
        <div className="w-16 h-16 mx-auto rounded-full border-2 border-[var(--scouter-green)] bg-[rgba(57,255,20,0.1)] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-[var(--scouter-green)] animate-spin" />
        </div>
        <div className="space-y-1">
          <p className="font-dot text-xs text-[var(--scouter-green)] tracking-widest">
            ENHANCING RESULT...
          </p>
          <p className="text-xs text-[var(--foreground)] opacity-60">
            ナレッジベースで診断を強化中
          </p>
        </div>
      </div>
    </div>
  );
};
