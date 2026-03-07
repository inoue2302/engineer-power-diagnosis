let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/** ユーザー送信 — 短いビーム音（ピュン） */
export function playSendSound() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "sine";
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.08);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
}

/** 王子メッセージ着弾 — 衝撃音（ドン） */
export function playImpactSound() {
  const ctx = getAudioContext();

  // Low hit
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "sine";
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);

  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);

  // Noise burst
  const bufferSize = ctx.sampleRate * 0.1;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  const noiseGain = ctx.createGain();
  noise.buffer = buffer;
  noise.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noiseGain.gain.setValueAtTime(0.08, ctx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  noise.start(ctx.currentTime);
  noise.stop(ctx.currentTime + 0.1);
}

/** 測定装置風ビープ（ピピッ） */
export function playScouterBeep() {
  const ctx = getAudioContext();

  for (let i = 0; i < 2; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "square";
    osc.frequency.setValueAtTime(1800, ctx.currentTime + i * 0.08);

    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i * 0.08 + 0.01);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.08 + 0.05);

    osc.start(ctx.currentTime + i * 0.08);
    osc.stop(ctx.currentTime + i * 0.08 + 0.05);
  }
}

/** 診断結果 — 溜め→爆発（ゴゴゴ…ドーン） */
export function playResultSound() {
  const ctx = getAudioContext();

  // Charge-up rumble
  const rumbleOsc = ctx.createOscillator();
  const rumbleGain = ctx.createGain();
  rumbleOsc.connect(rumbleGain);
  rumbleGain.connect(ctx.destination);

  rumbleOsc.type = "sawtooth";
  rumbleOsc.frequency.setValueAtTime(60, ctx.currentTime);
  rumbleOsc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.6);

  rumbleGain.gain.setValueAtTime(0.02, ctx.currentTime);
  rumbleGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.5);
  rumbleGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);

  rumbleOsc.start(ctx.currentTime);
  rumbleOsc.stop(ctx.currentTime + 0.6);

  // Explosion hit
  const hitOsc = ctx.createOscillator();
  const hitGain = ctx.createGain();
  hitOsc.connect(hitGain);
  hitGain.connect(ctx.destination);

  hitOsc.type = "sine";
  hitOsc.frequency.setValueAtTime(200, ctx.currentTime + 0.6);
  hitOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.2);

  hitGain.gain.setValueAtTime(0.3, ctx.currentTime + 0.6);
  hitGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

  hitOsc.start(ctx.currentTime + 0.6);
  hitOsc.stop(ctx.currentTime + 1.2);

  // High ring
  const ringOsc = ctx.createOscillator();
  const ringGain = ctx.createGain();
  ringOsc.connect(ringGain);
  ringGain.connect(ctx.destination);

  ringOsc.type = "sine";
  ringOsc.frequency.setValueAtTime(1200, ctx.currentTime + 0.6);
  ringOsc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 1.5);

  ringGain.gain.setValueAtTime(0.08, ctx.currentTime + 0.6);
  ringGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

  ringOsc.start(ctx.currentTime + 0.6);
  ringOsc.stop(ctx.currentTime + 1.5);
}
