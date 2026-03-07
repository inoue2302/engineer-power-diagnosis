import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Deep space background with radial energy */}
      <div
        className="fixed inset-0 animate-bg-energy"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(255,107,0,0.12) 0%, rgba(255,149,0,0.05) 30%, rgba(5,5,5,1) 70%)",
          backgroundSize: "400% 400%",
        }}
      />

      {/* Rotating energy ring */}
      <div
        className="fixed animate-ring-rotate pointer-events-none"
        style={{
          top: "45%",
          left: "50%",
          width: "min(600px, 90vw)",
          height: "min(600px, 90vw)",
          border: "1px solid rgba(255,107,0,0.1)",
          borderRadius: "50%",
          borderTopColor: "rgba(255,107,0,0.4)",
        }}
      />
      <div
        className="fixed animate-ring-pulse pointer-events-none"
        style={{
          top: "45%",
          left: "50%",
          width: "min(450px, 70vw)",
          height: "min(450px, 70vw)",
          border: "1px solid rgba(255,215,0,0.08)",
          borderRadius: "50%",
        }}
      />

      {/* Energy particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="energy-particle"
          style={{
            left: `${10 + Math.random() * 80}%`,
            bottom: "-10px",
            animationDuration: `${3 + Math.random() * 5}s`,
            animationDelay: `${Math.random() * 5}s`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            opacity: 0.3 + Math.random() * 0.4,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Scouter HUD top */}
        <div
          className="animate-slide-up mb-8 flex items-center gap-3"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          <div
            className="animate-hud-line h-px bg-gradient-to-r from-transparent to-[var(--scouter-green)]"
            style={{ width: "60px" }}
          />
          <span className="scouter-text text-xs tracking-[0.3em] uppercase animate-scouter-blink">
            SCANNING...
          </span>
          <div
            className="animate-hud-line h-px bg-gradient-to-l from-transparent to-[var(--scouter-green)]"
            style={{ width: "60px" }}
          />
        </div>

        {/* Title */}
        <h1
          className="font-gothic animate-crack-in"
          style={{ animationDelay: "0.4s", animationFillMode: "both" }}
        >
          <span className="block text-lg sm:text-xl tracking-[0.2em] text-[var(--foreground)] opacity-60 mb-2">
            ─── POWER LEVEL ───
          </span>
          <span className="block energy-text text-4xl sm:text-6xl md:text-7xl leading-tight animate-energy-flicker">
            エンジニア
          </span>
          <span className="block energy-text text-4xl sm:text-6xl md:text-7xl leading-tight animate-energy-flicker">
            戦闘力診断
          </span>
        </h1>

        {/* Scouter power readout */}
        <div
          className="mt-8 animate-slide-up"
          style={{ animationDelay: "0.8s", animationFillMode: "both" }}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--scouter-green)] animate-scouter-blink" />
            <span className="font-dot text-[var(--scouter-green)] text-sm tracking-widest">
              POWER LEVEL:
            </span>
            <span className="font-dot text-[var(--scouter-green)] text-2xl sm:text-3xl tracking-wider animate-scouter-blink">
              ????
            </span>
          </div>
        </div>

        {/* Catchcopy */}
        <p
          className="mt-8 text-lg sm:text-xl text-[var(--foreground)] opacity-80 font-gothic animate-slide-up"
          style={{ animationDelay: "1s", animationFillMode: "both" }}
        >
          「俺様が貴様の実力を測ってやろう」
        </p>

        {/* CTA Button */}
        <div
          className="mt-10 animate-slide-up"
          style={{ animationDelay: "1.2s", animationFillMode: "both" }}
        >
          <Link href="/diagnosis">
            <button className="group relative cursor-pointer">
              {/* Button glow background */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--energy-orange)] via-[var(--energy-gold)] to-[var(--energy-orange)] rounded-lg opacity-50 group-hover:opacity-80 blur-sm transition-all duration-500 animate-power-charge" />

              {/* Button body */}
              <div className="relative flex items-center gap-3 bg-[#0a0a0a] border border-[var(--energy-orange)] rounded-lg px-10 py-4 transition-all duration-300 group-hover:border-[var(--energy-gold)] group-hover:bg-[#111]">
                <span className="font-gothic text-xl sm:text-2xl energy-text tracking-wider">
                  診断スタート
                </span>
                <span className="text-[var(--energy-orange)] text-2xl transition-transform duration-300 group-hover:translate-x-1">
                  ▸
                </span>
              </div>
            </button>
          </Link>
        </div>

        {/* Info badges */}
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-4 animate-slide-up"
          style={{ animationDelay: "1.4s", animationFillMode: "both" }}
        >
          <div className="flex items-center gap-2 border border-[rgba(255,107,0,0.2)] rounded px-3 py-1.5 bg-[rgba(255,107,0,0.05)]">
            <span className="font-dot text-[var(--energy-amber)] text-xs">
              ⏱
            </span>
            <span className="font-dot text-[var(--foreground)] opacity-60 text-xs tracking-wider">
              約5分
            </span>
          </div>
          <div className="flex items-center gap-2 border border-[rgba(255,107,0,0.2)] rounded px-3 py-1.5 bg-[rgba(255,107,0,0.05)]">
            <span className="font-dot text-[var(--energy-amber)] text-xs">
              💬
            </span>
            <span className="font-dot text-[var(--foreground)] opacity-60 text-xs tracking-wider">
              全10問の対話形式
            </span>
          </div>
        </div>

        {/* Bottom HUD decoration */}
        <div
          className="mt-12 flex items-center gap-2 opacity-30 animate-slide-up"
          style={{ animationDelay: "1.6s", animationFillMode: "both" }}
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[var(--energy-orange)]" />
          <div className="w-1.5 h-1.5 rotate-45 border border-[var(--energy-orange)]" />
          <span className="font-dot text-[10px] text-[var(--energy-orange)] tracking-[0.5em]">
            READY
          </span>
          <div className="w-1.5 h-1.5 rotate-45 border border-[var(--energy-orange)]" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[var(--energy-orange)]" />
        </div>
      </div>
    </div>
  );
}
