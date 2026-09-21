import React, { useState } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  MessageCircle,
  Video,
  Building2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../sound/SoundFX';
import doctorData from '../../data/doctorData.json';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedService?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  preSelectedService = 'Heart Consultation'
}) => {
  const { doctor, clinic } = doctorData;
  const [step, setStep] = useState<number>(1);
  const [service, setService] = useState<string>(preSelectedService);
  const [consultType, setConsultType] = useState<'in-clinic' | 'telehealth'>('in-clinic');
  const [date, setDate] = useState<string>('2026-09-24');
  const [timeSlot, setTimeSlot] = useState<string>('10:30 AM');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const servicesList = doctorData.services.map(s => s.title);

  const timeSlots = [
    '09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM',
    '02:30 PM', '03:15 PM', '04:00 PM', '05:00 PM'
  ];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Submit booking
      soundManager.playSuccess();
      setIsSubmitted(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  };

  const handleWhatsAppNotify = () => {
    soundManager.playClick();
    const message = `Hello ${doctor.name} Clinic, I have requested an appointment for *${service}* on *${date}* at *${timeSlot}*.%0APatient Name: ${name}%0APhone: ${phone}`;
    window.open(`https://wa.me/${clinic.whatsAppNumber}?text=${message}`, '_blank');
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-teal-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-brand-teal border border-teal-100">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-slate-900">
                  Book Cardiac Appointment
                </h3>
                <p className="text-xs text-slate-500">
                  Direct consultation with {doctor.name} ({doctor.degrees})
                </p>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 1 ? 'text-brand-teal' : 'text-slate-400'}`}>
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-brand-teal text-white' : 'bg-slate-100 text-slate-500'}`}>1</span>
                <span>Select Service & Time</span>
              </div>
              <div className="h-0.5 w-12 bg-slate-200"></div>
              <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 2 ? 'text-brand-teal' : 'text-slate-400'}`}>
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-brand-teal text-white' : 'bg-slate-100 text-slate-500'}`}>2</span>
                <span>Patient Information</span>
              </div>
            </div>

            <form onSubmit={handleNextStep} className="space-y-5">
              {step === 1 && (
                <>
                  {/* Consultation Mode */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Consultation Mode:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          setConsultType('in-clinic');
                        }}
                        className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                          consultType === 'in-clinic'
                            ? 'bg-teal-50 border-brand-teal text-brand-teal shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Building2 className="h-4 w-4" />
                        <span>In-Clinic (New Delhi)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          setConsultType('telehealth');
                        }}
                        className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                          consultType === 'telehealth'
                            ? 'bg-teal-50 border-brand-teal text-brand-teal shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Video className="h-4 w-4" />
                        <span>Online Video Consult</span>
                      </button>
                    </div>
                  </div>

                  {/* Service selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Select Service / Discipline:
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-3 text-sm font-medium text-slate-800 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal bg-white"
                    >
                      {servicesList.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date & Slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                        Preferred Date:
                      </label>
                      <input
                        type="date"
                        value={date}
                        min="2026-09-22"
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm font-medium text-slate-800 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                        Available Time Slot:
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-3 text-sm font-medium text-slate-800 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal bg-white"
                      >
                        {timeSlots.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-brand-teal text-white font-semibold text-sm hover:bg-brand-tealLight shadow-lg shadow-brand-teal/25 transition-all"
                    >
                      Continue to Patient Details →
                    </button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Patient Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Chandra"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-sm font-medium text-slate-800 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Contact Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="tel"
                          placeholder="+91 98765 00000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-sm font-medium text-slate-800 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          placeholder="patient@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-sm font-medium text-slate-800 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Brief Symptoms / Medical Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Mild chest pressure, routine annual cardiac review, past history of stent"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-3 text-sm font-medium text-slate-800 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal"
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      ← Back
                    </button>

                    <button
                      type="submit"
                      className="px-7 py-3 rounded-xl bg-brand-teal text-white font-semibold text-sm hover:bg-brand-tealLight shadow-lg shadow-brand-teal/25 transition-all"
                    >
                      Confirm Booking Request
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-slate-900">
              Appointment Request Confirmed!
            </h3>

            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-slate-900">{name || 'Patient'}</strong>. Your consultation for <strong className="text-brand-teal">{service}</strong> on <strong className="text-slate-900">{date}</strong> at <strong className="text-slate-900">{timeSlot}</strong> has been registered with Dr. Anil Sharma's front desk.
            </p>

            <div className="rounded-2xl bg-teal-50/80 p-4 border border-teal-200/80 text-left text-xs space-y-1 max-w-sm mx-auto">
              <div className="text-slate-500 font-medium">Clinic Reference ID: <strong className="font-mono text-slate-800">DRAS-{Math.floor(100000 + Math.random() * 900000)}</strong></div>
              <div className="text-slate-500 font-medium">Mode: <strong className="text-slate-800 capitalize">{consultType}</strong></div>
              <div className="text-emerald-700 font-semibold pt-1">SMS & WhatsApp confirmation sent.</div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={handleWhatsAppNotify}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Notify Clinic on WhatsApp</span>
              </button>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
