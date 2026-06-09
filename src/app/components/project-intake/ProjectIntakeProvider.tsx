'use client';

import {
  createContext,
  type FormEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type IntakeIntent = 'start_project' | 'project_brief' | 'estimate';

type OpenIntakeOptions = {
  intent?: IntakeIntent;
  sourceButton?: string;
};

type ProjectIntakeContextValue = {
  openIntake: (options?: OpenIntakeOptions) => void;
  closeIntake: () => void;
};

type IntakeFormState = {
  project_type: string;
  services_needed: string[];
  timeline: string;
  reference_links_input: string;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  preferred_contact_method: string;
  website: string;
};

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

const ProjectIntakeContext = createContext<ProjectIntakeContextValue | null>(null);

const PROJECT_TYPES = [
  { label: 'Web App', value: 'web_app' },
  { label: 'Mobile App', value: 'mobile_app' },
  { label: 'SaaS Platform', value: 'saas_platform' },
  { label: 'Dashboard / Admin Panel', value: 'dashboard' },
  { label: 'Marketplace', value: 'marketplace' },
  { label: 'ERP / Internal Tool', value: 'erp_internal_tool' },
  { label: 'Automation System', value: 'automation_system' },
  { label: 'Not Sure Yet', value: 'not_sure' },
];

const SERVICES_NEEDED = [
  { label: 'UI/UX Design', value: 'ui_ux_design' },
  { label: 'Frontend Development', value: 'frontend' },
  { label: 'Backend Development', value: 'backend' },
  { label: 'Admin Dashboard', value: 'admin_dashboard' },
  { label: 'Payment Integration', value: 'payment_integration' },
  { label: 'Authentication', value: 'authentication' },
  { label: 'Booking System', value: 'booking_system' },
  { label: 'Chat / Messaging', value: 'chat_messaging' },
  { label: 'AI Features', value: 'ai_features' },
  { label: 'Analytics', value: 'analytics' },
  { label: 'Maintenance', value: 'maintenance' },
];

const TIMELINES = [
  { label: 'ASAP', value: 'asap' },
  { label: '2-4 weeks', value: '2_4_weeks' },
  { label: '1-2 months', value: '1_2_months' },
  { label: '2-3 months', value: '2_3_months' },
  { label: 'Flexible', value: 'flexible' },
];

const CONTACT_METHODS = [
  { label: 'Email', value: 'email' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Call', value: 'call' },
  { label: 'Google Meet', value: 'google_meet' },
];

const STEPS = [
  'Project Type',
  'Services Needed',
  'Timeline',
  'Contact Details',
];

const DEFAULT_FORM: IntakeFormState = {
  project_type: '',
  services_needed: [],
  timeline: '',
  reference_links_input: '',
  name: '',
  email: '',
  phone: '',
  company_name: '',
  preferred_contact_method: 'email',
  website: '',
};

function splitReferenceLinks(value: string) {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function useProjectIntake() {
  const context = useContext(ProjectIntakeContext);
  if (!context) {
    throw new Error('useProjectIntake must be used within ProjectIntakeProvider');
  }
  return context;
}

export default function ProjectIntakeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<IntakeFormState>(DEFAULT_FORM);
  const [intent, setIntent] = useState<IntakeIntent>('start_project');
  const [sourceButton, setSourceButton] = useState('Start a Project');
  const [sourcePage, setSourcePage] = useState('');
  const [stepError, setStepError] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState('');
  const openerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const resetForm = useCallback(() => {
    setStep(0);
    setForm(DEFAULT_FORM);
    setStepError('');
    setSubmitError('');
    setSubmitState('idle');
  }, []);

  const closeIntake = useCallback(() => {
    setIsOpen(false);
    window.setTimeout(() => {
      openerRef.current?.focus?.();
      openerRef.current = null;
    }, 0);
  }, []);

  const openIntake = useCallback(
    (options?: OpenIntakeOptions) => {
      openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setIntent(options?.intent ?? 'start_project');
      setSourceButton(options?.sourceButton ?? 'Start a Project');
      setSourcePage(`${window.location.pathname}${window.location.search}`);
      resetForm();
      setIsOpen(true);
    },
    [resetForm],
  );

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const firstFocusable = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>('.pimClose')?.focus();
    }, 0);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(firstFocusable);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeIntake();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeIntake, isOpen]);

  const updateField = <K extends keyof IntakeFormState>(field: K, value: IntakeFormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setStepError('');
    setSubmitError('');
  };

  const toggleService = (value: string) => {
    setForm((current) => ({
      ...current,
      services_needed: current.services_needed.includes(value)
        ? current.services_needed.filter((item) => item !== value)
        : [...current.services_needed, value],
    }));
    setStepError('');
  };

  const validateStep = (targetStep = step) => {
    if (targetStep === 0 && !form.project_type) return 'Select a project type.';
    if (targetStep === 3) {
      if (!form.name.trim()) return 'Add your name.';
      if (!form.email.trim() && !form.phone.trim()) return 'Add either email or phone.';
    }
    return '';
  };

  const goNext = () => {
    const error = validateStep(step);
    if (error) {
      setStepError(error);
      return;
    }
    setStepError('');
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setStepError('');
    setStep((current) => Math.max(current - 1, 0));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const error = validateStep(3);
    if (error) {
      setStepError(error);
      setStep(3);
      return;
    }

    setSubmitState('loading');
    setSubmitError('');

    try {
      const response = await fetch('/api/project-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent,
          project_type: form.project_type,
          services_needed: form.services_needed,
          timeline: form.timeline,
          reference_links: splitReferenceLinks(form.reference_links_input),
          name: form.name,
          email: form.email,
          phone: form.phone,
          company_name: form.company_name,
          preferred_contact_method: form.preferred_contact_method,
          source_page: sourcePage,
          source_button: sourceButton,
          website: form.website,
        }),
      });
      const data = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Could not submit your details.');
      }
      setSubmitState('success');
    } catch (error) {
      setSubmitState('error');
      setSubmitError(error instanceof Error ? error.message : 'Could not submit your details.');
    }
  };

  const value = useMemo<ProjectIntakeContextValue>(
    () => ({ openIntake, closeIntake }),
    [closeIntake, openIntake],
  );

  const renderStep = () => {
    if (step === 0) {
      return (
        <ChoiceGrid
          options={PROJECT_TYPES}
          value={form.project_type}
          onChange={(value) => updateField('project_type', value)}
        />
      );
    }

    if (step === 1) {
      return (
        <div className="pimChoices">
          {SERVICES_NEEDED.map((option) => {
            const active = form.services_needed.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                className={`pimChoice${active ? ' isActive' : ''}`}
                onClick={() => toggleService(option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      );
    }

    if (step === 2) {
      return (
        <ChoiceGrid
          options={TIMELINES}
          value={form.timeline}
          onChange={(value) => updateField('timeline', value)}
        />
      );
    }

    return (
      <div className="pimFieldStack">
        <input
          className="pimHoneypot"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => updateField('website', event.target.value)}
          aria-hidden="true"
          name="website"
        />
        <div className="pimTwoCol">
          <label className="pimField">
            <span>Name *</span>
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              autoComplete="name"
            />
          </label>
          <label className="pimField">
            <span>Company</span>
            <input
              value={form.company_name}
              onChange={(event) => updateField('company_name', event.target.value)}
              autoComplete="organization"
            />
          </label>
        </div>
        <div className="pimTwoCol">
          <label className="pimField">
            <span>Email</span>
            <input
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              autoComplete="email"
              inputMode="email"
            />
          </label>
          <label className="pimField">
            <span>Phone / WhatsApp</span>
            <input
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              autoComplete="tel"
              inputMode="tel"
            />
          </label>
        </div>
        <ChoiceGrid
          options={CONTACT_METHODS}
          value={form.preferred_contact_method}
          onChange={(value) => updateField('preferred_contact_method', value)}
        />
        <label className="pimField">
          <span>Reference Links</span>
          <textarea
            value={form.reference_links_input}
            onChange={(event) => updateField('reference_links_input', event.target.value)}
            placeholder="Paste links separated by commas or new lines."
            rows={3}
          />
        </label>
      </div>
    );
  };

  return (
    <ProjectIntakeContext.Provider value={value}>
      {children}
      {isOpen && (
        <div
          className="pimBackdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeIntake();
          }}
        >
          <div
            ref={dialogRef}
            className="pimDialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pim-title"
          >
            <div className="pimGrid" aria-hidden="true" />
            <div className="pimScan" aria-hidden="true" />

            <header className="pimHeader">
              <div>
                <span className="pimKicker">PROJECT INTAKE / {intent.replace(/_/g, ' ')}</span>
                <h2 id="pim-title">Scope the build</h2>
              </div>
              <button type="button" className="pimClose" onClick={closeIntake} aria-label="Close project intake">
                CLOSE
              </button>
            </header>

            {submitState === 'success' ? (
              <section className="pimSuccess">
                <span className="pimSuccessMark">OK</span>
                <h3>BRIEF RECEIVED</h3>
                <p>We will review your details and respond within one business day.</p>
                <div className="pimSuccessActions">
                  <button type="button" className="pimPrimary" onClick={closeIntake}>
                    Close
                  </button>
                  <button type="button" className="pimSecondary" onClick={resetForm}>
                    Send Another Request
                  </button>
                </div>
              </section>
            ) : (
              <form className="pimBody" onSubmit={submit}>
                <aside className="pimProgress" aria-label="Intake progress">
                  {STEPS.map((label, index) => (
                    <button
                      key={label}
                      type="button"
                      className={`pimProgressStep${index === step ? ' isActive' : ''}${index < step ? ' isDone' : ''}`}
                      onClick={() => {
                        if (index <= step) {
                          setStep(index);
                          setStepError('');
                        }
                      }}
                    >
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      {label}
                    </button>
                  ))}
                </aside>

                <section className="pimStepPanel">
                  <div className="pimStepHead">
                    <span>STEP {String(step + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}</span>
                    <h3>{STEPS[step]}</h3>
                    <p>{getStepHelp(step)}</p>
                  </div>

                  {renderStep()}

                  {(stepError || submitError) && (
                    <p className="pimError" role="alert">{stepError || submitError}</p>
                  )}

                  <div className="pimControls">
                    <button type="button" className="pimSecondary" onClick={goBack} disabled={step === 0 || submitState === 'loading'}>
                      Back
                    </button>
                    {step < STEPS.length - 1 ? (
                      <button type="button" className="pimPrimary" onClick={goNext}>
                        Next
                      </button>
                    ) : (
                      <button type="submit" className="pimPrimary" disabled={submitState === 'loading'}>
                        {submitState === 'loading' ? 'Submitting...' : 'Send Details'}
                      </button>
                    )}
                  </div>
                </section>
              </form>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        .pimBackdrop {
          position: fixed;
          inset: 0;
          z-index: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.76);
          color: rgba(255, 255, 255, 0.9);
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          backdrop-filter: blur(10px);
          isolation: isolate;
        }

        .pimDialog {
          position: relative;
          width: min(900px, 100%);
          max-height: min(760px, calc(100dvh - 40px));
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.055), transparent 38%),
            linear-gradient(180deg, #0b0b0b 0%, #050505 100%);
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.6);
          overflow: hidden;
        }

        .pimGrid,
        .pimScan {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .pimGrid {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.024) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.024) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: radial-gradient(circle at 50% 18%, #000 0 44%, transparent 78%);
          -webkit-mask-image: radial-gradient(circle at 50% 18%, #000 0 44%, transparent 78%);
        }

        .pimScan {
          background: repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent 2px,
            rgba(255, 255, 255, 0.026) 3px,
            transparent 4px
          );
          opacity: 0.42;
        }

        .pimHeader {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          padding: 18px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.11);
        }

        .pimKicker,
        .pimStepHead span {
          color: rgba(255, 255, 255, 0.42);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .pimHeader h2,
        .pimStepHead h3,
        .pimSuccess h3 {
          margin: 6px 0 0;
          color: rgba(255, 255, 255, 0.96);
          font-size: clamp(24px, 3vw, 34px);
          font-weight: 400;
          line-height: 1;
          text-transform: uppercase;
        }

        .pimClose,
        .pimPrimary,
        .pimSecondary {
          min-height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.025);
          color: rgba(255, 255, 255, 0.74);
          font: inherit;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: border-color 160ms ease, background 160ms ease, color 160ms ease;
        }

        .pimClose:hover,
        .pimClose:focus-visible,
        .pimPrimary:hover,
        .pimPrimary:focus-visible,
        .pimSecondary:hover,
        .pimSecondary:focus-visible {
          border-color: rgba(255, 255, 255, 0.42);
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.96);
          outline: none;
        }

        .pimPrimary {
          border-color: rgba(255, 255, 255, 0.36);
          color: rgba(255, 255, 255, 0.94);
        }

        .pimPrimary:disabled,
        .pimSecondary:disabled {
          opacity: 0.42;
          cursor: not-allowed;
        }

        .pimBody {
          position: relative;
          z-index: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: 240px minmax(0, 1fr);
          overflow: hidden;
        }

        .pimProgress {
          display: flex;
          flex-direction: column;
          gap: 7px;
          padding: 18px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.012);
        }

        .pimProgressStep {
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr);
          align-items: center;
          gap: 8px;
          min-height: 34px;
          padding: 0 9px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: transparent;
          color: rgba(255, 255, 255, 0.42);
          font: inherit;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-align: left;
          text-transform: uppercase;
        }

        .pimProgressStep span {
          color: rgba(255, 255, 255, 0.28);
        }

        .pimProgressStep.isActive,
        .pimProgressStep.isDone {
          border-color: rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.035);
          color: rgba(255, 255, 255, 0.82);
        }

        .pimStepPanel {
          min-height: 0;
          overflow-y: auto;
          padding: 20px;
        }

        .pimStepHead {
          margin-bottom: 16px;
        }

        .pimStepHead h3 {
          font-size: clamp(22px, 2.4vw, 30px);
        }

        .pimStepHead p,
        .pimSuccess p {
          max-width: 54ch;
          margin: 8px 0 0;
          color: rgba(255, 255, 255, 0.56);
          font-family: var(--font-geist-sans, sans-serif);
          font-size: 13px;
          line-height: 1.55;
        }

        .pimChoices {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .pimChoice {
          min-height: 46px;
          padding: 10px 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.028), rgba(255, 255, 255, 0.006)),
            rgba(0, 0, 0, 0.16);
          color: rgba(255, 255, 255, 0.7);
          font: inherit;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          line-height: 1.3;
          text-align: left;
          text-transform: uppercase;
          cursor: pointer;
        }

        .pimChoice.isActive,
        .pimChoice:hover,
        .pimChoice:focus-visible {
          border-color: rgba(255, 255, 255, 0.42);
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.96);
          outline: none;
        }

        .pimFieldStack {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .pimTwoCol {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .pimField {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .pimField span {
          color: rgba(255, 255, 255, 0.42);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .pimField input,
        .pimField textarea,
        .pimField select {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.02);
          color: rgba(255, 255, 255, 0.9);
          font: inherit;
          font-size: 12px;
          line-height: 1.5;
          outline: none;
        }

        .pimField input,
        .pimField select {
          height: 42px;
          padding: 0 11px;
        }

        .pimField textarea {
          min-height: 110px;
          resize: vertical;
          padding: 10px 11px;
          font-family: var(--font-geist-sans, sans-serif);
        }

        .pimField input:focus,
        .pimField textarea:focus,
        .pimField select:focus {
          border-color: rgba(255, 255, 255, 0.4);
        }

        .pimHoneypot {
          position: absolute;
          left: -10000px;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .pimError {
          margin: 12px 0 0;
          color: rgba(255, 255, 255, 0.88);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .pimControls,
        .pimSuccessActions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 18px;
        }

        .pimSuccess {
          position: relative;
          z-index: 1;
          padding: 44px 28px 30px;
        }

        .pimSuccessMark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.72);
          font-size: 10px;
          font-weight: 800;
        }

        @media (max-width: 767px) {
          .pimBackdrop {
            align-items: stretch;
            padding: 0;
          }

          .pimDialog {
            width: 100%;
            max-height: none;
            height: 100vh;
            height: 100dvh;
            border-inline: 0;
          }

          .pimHeader {
            padding: 13px;
          }

          .pimHeader h2 {
            font-size: 24px;
          }

          .pimBody {
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .pimProgress {
            flex: none;
            flex-direction: row;
            gap: 7px;
            overflow-x: auto;
            padding: 10px 13px;
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            scrollbar-width: none;
          }

          .pimProgress::-webkit-scrollbar {
            display: none;
          }

          .pimProgressStep {
            flex: 0 0 auto;
            grid-template-columns: auto;
            min-height: 30px;
            min-width: 42px;
            padding: 0 10px;
            font-size: 0;
          }

          .pimProgressStep span {
            font-size: 9px;
          }

          .pimStepPanel {
            flex: 1;
            padding: 14px 13px 18px;
          }

          .pimStepHead {
            margin-bottom: 12px;
          }

          .pimStepHead h3 {
            font-size: 22px;
          }

          .pimStepHead p {
            font-size: 12px;
            line-height: 1.45;
          }

          .pimChoices,
          .pimTwoCol {
            grid-template-columns: 1fr;
          }

          .pimChoice {
            min-height: 40px;
            padding: 9px 10px;
            font-size: 9.5px;
          }

          .pimField input,
          .pimField select {
            height: 40px;
          }

          .pimField textarea {
            min-height: 96px;
          }

          .pimControls,
          .pimSuccessActions {
            position: sticky;
            bottom: 0;
            margin: 14px -13px -18px;
            padding: 10px 13px;
            background: rgba(5, 5, 5, 0.94);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .pimPrimary,
          .pimSecondary {
            flex: 1;
            min-height: 42px;
          }

          .pimSuccess {
            padding: 34px 16px 18px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pimClose,
          .pimPrimary,
          .pimSecondary {
            transition: none !important;
          }
        }
      `}</style>
    </ProjectIntakeContext.Provider>
  );
}

function ChoiceGrid({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="pimChoices">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`pimChoice${value === option.value ? ' isActive' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function getStepHelp(step: number) {
  switch (step) {
    case 0:
      return 'Pick the closest product type. If details are unclear, choose Not Sure Yet.';
    case 1:
      return 'Select every capability you expect us to cover. This can be refined later.';
    case 2:
      return 'Timeline gives the intake team a delivery constraint to plan around.';
    default:
      return 'Add contact details so we can respond with the next step.';
  }
}
