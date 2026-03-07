import type { MessageRole } from "@/types/diagnosis";
import { parseDiagnosisResult, stripJsonBlock } from "@/lib/parse-result";
import { DiagnosisResultCard } from "@/components/DiagnosisResultCard";

type ChatMessageProps = {
  role: MessageRole;
  content: string;
  isLoading?: boolean;
};

export const ChatMessage = ({ role, content, isLoading }: ChatMessageProps) => {
  const isAssistant = role === "assistant";
  const diagnosisResult = isAssistant ? parseDiagnosisResult(content) : null;
  const displayContent = diagnosisResult ? stripJsonBlock(content) : content;

  return (
    <div
      className={`flex gap-3 ${isAssistant ? "justify-start" : "justify-end"} ${
        !isLoading ? (isAssistant ? "animate-impact" : "animate-ki-blast") : ""
      }`}
    >
      {isAssistant && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[var(--energy-orange)] to-[var(--energy-amber)] flex items-center justify-center text-lg shadow-[0_0_15px_rgba(255,107,0,0.3)]">
          👑
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isAssistant
            ? "bg-[rgba(255,107,0,0.08)] border border-[rgba(255,107,0,0.15)] text-[var(--foreground)]"
            : "bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-[var(--foreground)]"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--energy-orange)] animate-bounce" />
            <span
              className="w-1.5 h-1.5 rounded-full bg-[var(--energy-orange)] animate-bounce"
              style={{ animationDelay: "0.15s" }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full bg-[var(--energy-orange)] animate-bounce"
              style={{ animationDelay: "0.3s" }}
            />
          </div>
        ) : (
          <>
            {displayContent && (
              <p className="whitespace-pre-wrap">{displayContent}</p>
            )}
            {diagnosisResult && (
              <div className={displayContent ? "mt-4" : ""}>
                <DiagnosisResultCard result={diagnosisResult} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
