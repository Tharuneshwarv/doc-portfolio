import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  CheckCircle2, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../sound/SoundFX';
import { ParallaxSection, ParallaxItem, TiltCard } from '../ui/ParallaxWrapper';

interface CardiacRiskQuizProps {
  onOpenBooking: () => void;
}

export const CardiacRiskQuiz: React.FC<CardiacRiskQuizProps> = ({ onOpenBooking }) => {
  const [age, setAge] = useState<number>(38);
  const [activity, setActivity] = useState<'sedentary' | 'moderate' | 'active'>('moderate');
  const [bpRange, setBpRange] = useState<'normal' | 'elevated' | 'high'>('normal');
  const [familyHistory, setFamilyHistory] = useState<boolean>(false);
  const [smoking, setSmoking] = useState<boolean>(false);

  let riskScore = 0;
  if (age > 45) riskScore += 25;
  else if (age > 35) riskScore += 15;
  else riskScore += 5;

  if (activity === 'sedentary') riskScore += 25;
  else if (activity === 'moderate') riskScore += 10;
  else riskScore += 0;

  if (bpRange === 'high') riskScore += 30;
  else if (bpRange === 'elevated') riskScore += 15;
  else riskScore += 0;

  if (familyHistory) riskScore += 20;
  if (smoking) riskScore += 20;

  riskScore = Math.min(100, Math.max(5, riskScore));

  let tier = 'Optimal & Low Risk';
  let tierColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
  let barColor = 'bg-emerald-500';
  let recommendation = 'Your cardiovascular indicators look well-balanced. Keep up regular aerobic activity, balanced micronutrients, and an annual preventive check-up.';

  if (riskScore > 60) {
    tier = 'Elevated Cardiac Risk';
    tierColor = 'text-red-700 bg-red-50 border-red-300';
    barColor = 'bg-red-500';
    recommendation = 'Multiple cardiovascular risk factors detected. We strongly advise booking a baseline 12-Lead ECG, Lipid Profile & consultation with Dr. Anil Sharma.';
  } else if (riskScore > 35) {
    tier = 'Moderate Risk - Preventive Focus';
    tierColor = 'text-amber-700 bg-amber-50 border-amber-300';
    barColor = 'bg-amber-500';
    recommendation = 'You have mild cumulative risk factors. Simple lifestyle tuning and a comprehensive cardiac stress evaluation can protect your arteries long-term.';
  }

  return (
    <ParallaxSection className="py-24 relative overflow-hidden z-10" zoom fade>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-mono font-bold text-brand-teal border border-teal-200 mb-3 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-brand-teal" />
            <span>[ 05 // CARDIAC RISK ASSESSMENT ENGINE ]</span>
          </div>
          <ParallaxItem speed={0.9}>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
              Evaluate Your Cardiac Wellness Profile
            </h2>
          </ParallaxItem>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Adjust the clinical parameters below to calculate your estimated cardiac risk index and receive customized medical recommendations.
          </p>
        </div>

        {/* Interactive Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Controls */}
          <div className="lg:col-span-7 rounded-3xl spatial-card-light p-6 sm:p-8 space-y-6">
            
            {/* Age Slider */}
            <div>
              <div className="flex items-center justify-between text-sm font-semibold mb-2">
                <span className="text-slate-800 font-serif">Patient Age:</span>
                <span className="font-mono text-brand-teal font-bold text-base">{age} Years</span>
              </div>
              <input
                type="range"
                min="18"
                max="85"
                value={age}
                onChange={(e) => {
                  soundManager.playClick(600, 0.02);
                  setAge(Number(e.target.value));
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>18 yrs</span>
                <span>50 yrs</span>
                <span>85 yrs</span>
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 font-serif mb-2">
                Weekly Physical Activity:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'sedentary', label: 'Sedentary', desc: '< 30 min/wk' },
                  { id: 'moderate', label: 'Moderate', desc: '1-3 hrs/wk' },
                  { id: 'active', label: 'Active', desc: '> 3 hrs/wk' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      soundManager.playClick();
                      setActivity(item.id as 'sedentary' | 'moderate' | 'active');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      activity === item.id
                        ? 'bg-teal-50 border-brand-teal text-slate-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold font-mono">{item.label}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Blood Pressure Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 font-serif mb-2">
                Typical Blood Pressure (Resting):
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'normal', label: 'Normal (<120/80)' },
                  { id: 'elevated', label: 'Pre-HTN (120-139)' },
                  { id: 'high', label: 'High (≥140/90)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      soundManager.playClick();
                      setBpRange(item.id as 'normal' | 'elevated' | 'high');
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      bpRange === item.id
                        ? 'bg-teal-50 border-brand-teal text-brand-teal font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold font-mono">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Genetic and Lifestyle Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/80">
              <label
                onClick={() => {
                  soundManager.playClick();
                  setFamilyHistory(!familyHistory);
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer select-none transition-all ${
                  familyHistory
                    ? 'bg-teal-50 border-brand-teal text-slate-900 font-medium shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-semibold">Family History of Cardiac Disease</div>
                <div className={`h-5 w-5 rounded-md border flex items-center justify-center ${familyHistory ? 'bg-brand-teal border-brand-teal text-white' : 'border-slate-300'}`}>
                  {familyHistory && <CheckCircle2 className="h-4 w-4" />}
                </div>
              </label>

              <label
                onClick={() => {
                  soundManager.playClick();
                  setSmoking(!smoking);
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer select-none transition-all ${
                  smoking
                    ? 'bg-teal-50 border-brand-teal text-slate-900 font-medium shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-semibold">Tobacco / Cigarette Use</div>
                <div className={`h-5 w-5 rounded-md border flex items-center justify-center ${smoking ? 'bg-brand-teal border-brand-teal text-white' : 'border-slate-300'}`}>
                  {smoking && <CheckCircle2 className="h-4 w-4" />}
                </div>
              </label>
            </div>

          </div>

          {/* Right Live Score Output */}
          <div className="lg:col-span-5 rounded-3xl spatial-card-light p-6 sm:p-8 flex flex-col justify-between shadow-2xl border-teal-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <span className="text-xs font-mono uppercase text-slate-500 font-bold">[ RISK INDEX ]</span>
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${tierColor}`}>
                  {tier}
                </span>
              </div>

              {/* Score Display */}
              <div className="my-6 text-center">
                <div className="text-5xl font-mono font-bold text-slate-900 tracking-tight">
                  {riskScore} <span className="text-2xl text-slate-400 font-normal">/ 100</span>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4 h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${riskScore}%` }}
                  ></div>
                </div>

                <div className="mt-2 flex justify-between text-[11px] font-mono text-slate-500">
                  <span className="text-emerald-600 font-semibold">Low (0-35)</span>
                  <span className="text-amber-600 font-semibold">Moderate (36-60)</span>
                  <span className="text-red-600 font-semibold">High (&gt;60)</span>
                </div>
              </div>

              {/* Medical Advice Note */}
              <div className="rounded-2xl bg-teal-50/90 p-4 border border-teal-200 text-xs text-slate-700 leading-relaxed">
                <div className="font-bold text-brand-teal mb-1 flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
                  Clinical Advice from Dr. Anil Sharma:
                </div>
                {recommendation}
              </div>
            </div>

            {/* Direct Booking CTA */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-teal hover:bg-brand-tealLight text-white font-mono font-bold py-3.5 px-4 shadow-lg shadow-brand-teal/20 active:scale-95 transition-all text-xs uppercase"
              >
                <Calendar className="h-4 w-4" />
                <span>Schedule Risk Review</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </ParallaxSection>
  );
};
