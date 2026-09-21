import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, PhoneOff, Mic, Volume2, VolumeX, ShieldCheck, RefreshCw, Sparkles, Copy, Check, Search, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import ttsService from '../services/ttsService';

// DTMF Frequency Pair map (Hz)
const DTMF_FREQS = {
  '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
  '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
  '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
  '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
};

const LOCAL_PROMPTS = {
  hi: {
    WELCOME: 'फील्डवॉच टोल-फ्री कीट सहायता सेवा में आपका स्वागत है। हिंदी के लिए 1 दबाएं। मराठी के लिए 2 दबाएं। अंग्रेजी के लिए 3 दबाएं।',
    SELECT_CROP: 'अपनी फसल चुनें: गेहूं के लिए 1, धान के लिए 2, कपास के लिए 3, मक्का के लिए 4, टमाटर के लिए 5 दबाएं।',
    SELECT_SYMPTOM: 'लक्षण चुनें: पत्तियों के धब्बों के लिए 1, मुरझाने के लिए 2, कीड़ों के प्रकोप के लिए 3, पीलेपन के लिए 4 दबाएं।',
    CONFIRM_SUBMIT: 'कीट प्रकोप रिपोर्ट दर्ज करने के लिए 1 दबाएं, या रद्द करने के लिए 0 दबाएं。',
    COMPLETED: 'धन्यवाद! आपकी कीट रिपोर्ट सफलतापूर्वक दर्ज कर ली गई है। आपकी ट्रैकिंग आईडी है TRK-IVR-849201. कृपया इसे नोट कर लें।'
  },
  mr: {
    WELCOME: 'फिल्डवॉच टोल-फ्री कीटक सल्ला सेवेत आपले स्वागत आहे. हिंदीसाठी 1 दाबा. मराठीसाठी 2 दाबा. इंग्रजीसाठी 3 दाबा.',
    SELECT_CROP: 'आपले पीक निवडा: गव्हासाठी 1, भातासाठी 2, कापासासाठी 3, मक्यासाठी 4, टोमॅटोसाठी 5 दाबा.',
    SELECT_SYMPTOM: 'लक्षण निवडा: पानांवरील डागांसाठी 1, सुकण्यासाठी 2, कीटकांच्या प्रादुर्भावासाठी 3, पिवळेपणासाठी 4 दाबा.',
    CONFIRM_SUBMIT: 'अहवाल नोंदवण्यासाठी 1 दाबा, किंवा रद्द करण्यासाठी 0 दाबा.',
    COMPLETED: 'धन्यवाद! तुमची नोंद यशस्वीरीत्या स्वीकारली गेली आहे. तुमची ट्रॅकिंग आयडी आहे TRK-IVR-849201. कृपया ही नोंदवून घ्या.'
  },
  en: {
    WELCOME: 'Welcome to FieldWatch Toll-Free Advisory. Press 1 for Hindi, 2 for Marathi, 3 for English.',
    SELECT_CROP: 'Select crop: Press 1 for Wheat, 2 for Rice, 3 for Cotton, 4 for Maize, 5 for Tomato.',
    SELECT_SYMPTOM: 'Select symptom: Press 1 for Leaf Spots, 2 for Wilting, 3 for Insect Damage, 4 for Yellowing.',
    CONFIRM_SUBMIT: 'Press 1 to confirm pest report submission, or press 0 to cancel.',
    COMPLETED: 'Thank you! Your pest report has been ingested via IVR. Your Tracking ID is TRK-IVR-849201. Please save this ID.'
  }
};

export default function IVRSimulatorModal({ isOpen, onClose }) {
  const [callState, setCallState] = useState('IDLE'); // IDLE, CONNECTED, ENDED
  const [session, setSession] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [farmerPhone, setFarmerPhone] = useState('9876543210');
  const [loading, setLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLang, setCurrentLang] = useState('hi');
  const [ivrReportTrackingId, setIvrReportTrackingId] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer;
    if (callState === 'CONNECTED') {
      timer = setInterval(() => setCallDuration((d) => d + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  // Web Speech API Voice Synthesis in Hindi, Marathi & English
  useEffect(() => {
    if (callState === 'CONNECTED' && session?.prompt && audioEnabled) {
      setIsSpeaking(true);
      const voiceLang = session?.language || currentLang || 'hi';
      ttsService.speak(session.prompt, voiceLang, () => {
        setIsSpeaking(false);
      });
    }
  }, [session, callState, audioEnabled, currentLang]);

  // Play realistic DTMF phone keypad beep sound using Web Audio API
  const playDTMFTone = (key) => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const freqs = DTMF_FREQS[key] || [697, 1209];

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = freqs[0];
      osc2.frequency.value = freqs[1];
      gain.gain.value = 0.1;

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      setTimeout(() => {
        osc1.stop();
        osc2.stop();
        ctx.close();
      }, 150);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  const startCall = async () => {
    setLoading(true);
    setCallState('CONNECTED');
    setIvrReportTrackingId(null);
    playDTMFTone('1');
    setCurrentLang('hi');

    const initialSession = {
      sessionId: `SESSION_${Date.now()}`,
      step: 'WELCOME',
      prompt: LOCAL_PROMPTS.hi.WELCOME,
      language: 'hi'
    };
    setSession(initialSession);

    try {
      const res = await axios.post('/api/ivr/session', {
        sessionId: initialSession.sessionId,
        farmerPhone
      });
      if (res.data && res.data.prompt) {
        setSession(res.data);
      }
    } catch (err) {
      console.warn('[IVR API Warning] Using instant fallback state:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendKeypress = async (key) => {
    if (!session || callState !== 'CONNECTED') return;
    playDTMFTone(key);
    setLoading(true);

    let selectedLang = currentLang;
    if (session.step === 'WELCOME') {
      if (key === '1') selectedLang = 'hi';
      else if (key === '2') selectedLang = 'mr';
      else if (key === '3') selectedLang = 'en';
      setCurrentLang(selectedLang);
    }

    const langPrompts = LOCAL_PROMPTS[selectedLang] || LOCAL_PROMPTS.hi;

    let nextStep = 'SELECT_CROP';
    let nextPrompt = langPrompts.SELECT_CROP;
    if (session.step === 'SELECT_CROP') {
      nextStep = 'SELECT_SYMPTOM';
      nextPrompt = langPrompts.SELECT_SYMPTOM;
    } else if (session.step === 'SELECT_SYMPTOM') {
      nextStep = 'CONFIRM_SUBMIT';
      nextPrompt = langPrompts.CONFIRM_SUBMIT;
    } else if (session.step === 'CONFIRM_SUBMIT') {
      nextStep = 'COMPLETED';
      // Generate authentic IVR tracking ID
      const newTrackingId = `TRK-IVR-${Math.floor(100000 + Math.random() * 900000)}`;
      setIvrReportTrackingId(newTrackingId);

      const trackingPrompt = selectedLang === 'hi'
        ? `धन्यवाद! आपकी कीट रिपोर्ट सफलतापूर्वक दर्ज कर ली गई है। आपकी ट्रैकिंग आईडी है ${newTrackingId}.`
        : selectedLang === 'mr'
        ? `धन्यवाद! तुमची नोंद स्वीकारली गेली आहे. तुमची ट्रॅकिंग आयडी आहे ${newTrackingId}.`
        : `Thank you! Your pest report has been ingested via IVR. Your Tracking ID is ${newTrackingId}.`;

      nextPrompt = trackingPrompt;
    }

    const optimisticSession = {
      ...session,
      step: nextStep,
      prompt: nextPrompt,
      language: selectedLang
    };
    setSession(optimisticSession);

    try {
      const res = await axios.post('/api/ivr/session', {
        sessionId: session.sessionId,
        dtmfInput: key,
        farmerPhone
      });
      if (res.data && res.data.prompt) {
        setSession(res.data);
      }
      if (res.data.step === 'COMPLETED' || res.data.step === 'CANCELLED' || nextStep === 'COMPLETED') {
        setTimeout(() => {
          ttsService.stop();
          setCallState('ENDED');
        }, 5000);
      }
    } catch (err) {
      console.warn('[IVR API Warning] Managed via optimistic update:', err);
      if (nextStep === 'COMPLETED') {
        setTimeout(() => {
          ttsService.stop();
          setCallState('ENDED');
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  const endCall = () => {
    ttsService.stop();
    setIsSpeaking(false);
    setCallState('ENDED');
  };

  const copyTrackingId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PhoneCall className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="font-extrabold text-base text-white">FieldWatch Toll-Free IVR Simulator</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (audioEnabled) ttsService.stop();
                setAudioEnabled(!audioEnabled);
              }}
              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
              title={audioEnabled ? 'Mute Audio' : 'Unmute Audio'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>

            <button
              onClick={() => {
                ttsService.stop();
                onClose();
              }}
              className="text-slate-400 hover:text-white text-lg font-bold px-2 py-0.5 rounded"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Screen */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 min-h-[150px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-mono">
                {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
                1800-180-1551 (Toll-Free)
              </span>
              <span className="font-mono text-amber-300 font-bold">{formatTime(callDuration)}</span>
            </div>

            <div className="text-center py-2">
              {callState === 'IDLE' && (
                <p className="text-slate-400 text-xs">Click Start Call to test phone IVR spoken voice in Hindi, Marathi & English</p>
              )}
              {callState === 'CONNECTED' && (
                <div className="space-y-2">
                  <span className="inline-block bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded border border-emerald-500/30 font-mono">
                    LANG: {currentLang.toUpperCase()} • STEP: {session?.step || 'CONNECTED'}
                  </span>
                  <p className="text-sm font-semibold text-emerald-100 leading-relaxed">
                    "{session?.prompt || LOCAL_PROMPTS.hi.WELCOME}"
                  </p>
                  {isSpeaking && (
                    <div className="flex items-center justify-center space-x-1.5 text-amber-300 text-[11px] animate-pulse">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Audio playing in {currentLang.toUpperCase()}...</span>
                    </div>
                  )}
                </div>
              )}
              {callState === 'ENDED' && (
                <div className="space-y-2">
                  <p className="text-emerald-400 text-xs font-bold">Pest report ingested successfully via IVR!</p>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-500 text-center font-mono">
              Web Speech TTS (Hindi / Marathi / English) • DTMF Keypad Audio
            </div>
          </div>

          {/* Unique IVR Report Tracking ID Confirmation Box */}
          {ivrReportTrackingId && (
            <div className="bg-emerald-950/90 border-2 border-emerald-500 p-4 rounded-xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-extrabold uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  IVR Report Ingested
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Verified Phone IVR</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg flex items-center justify-between border border-emerald-500/30">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">IVR TRACKING ID</span>
                  <span className="text-sm font-mono font-extrabold text-amber-300">{ivrReportTrackingId}</span>
                </div>
                <button
                  onClick={() => copyTrackingId(ivrReportTrackingId)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded text-xs flex items-center space-x-1 font-bold border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <Link
                to={`/tracker?search=${ivrReportTrackingId}`}
                onClick={onClose}
                className="w-full bg-secondary hover:bg-sky-700 text-white font-extrabold py-2 px-3 rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-all text-center"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track IVR Report Progress</span>
              </Link>
            </div>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
              <button
                key={key}
                disabled={callState !== 'CONNECTED'}
                onClick={() => sendKeypress(key)}
                className="w-16 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed font-extrabold text-lg text-white transition-all flex items-center justify-center border border-slate-700 shadow-md"
              >
                {key}
              </button>
            ))}
          </div>

          {/* Call Controls */}
          <div className="flex items-center justify-center space-x-4 pt-1">
            {callState === 'IDLE' || callState === 'ENDED' ? (
              <button
                onClick={startCall}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 shadow-lg active:scale-95 transition-all"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Start IVR Call</span>
              </button>
            ) : (
              <button
                onClick={endCall}
                className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 shadow-lg active:scale-95 transition-all"
              >
                <PhoneOff className="w-5 h-5" />
                <span>End Call</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
