import { useState, useCallback } from 'react';
import { useCreateAppointment } from '../../hooks/useAppointments.js';
import StepProfessional from './StepProfessional.jsx';
import StepService from './StepService.jsx';
import StepDate from './StepDate.jsx';
import StepTime from './StepTime.jsx';
import StepConfirm from './StepConfirm.jsx';
import StepSuccess from './StepSuccess.jsx';

const STEPS = [
  { id: 1, label: 'Profesional' },
  { id: 2, label: 'Servicio'    },
  { id: 3, label: 'Fecha'       },
  { id: 4, label: 'Horario'     },
  { id: 5, label: 'Confirmar'   },
];

const INITIAL_STATE = {
  step: 1,
  professional: null,
  service: null,
  date: null,
  time: null,
  confirmedAppointment: null,
};

/**
 * Orquestador del wizard de reservas.
 *
 * useCreateAppointment() provee:
 *   - create(data)  → llama a Firestore con transacción atómica
 *   - saving        → true mientras espera respuesta de Firestore
 *   - saveError     → mensaje de error si Firestore rechaza la operación
 *
 * El spinner y el mensaje de error se pasan como props a StepConfirm.
 */
export default function Booking() {
  const { create, saving, saveError } = useCreateAppointment();
  const [state, setState] = useState(INITIAL_STATE);

  const goToStep = useCallback((step) => setState((s) => ({ ...s, step })), []);
  const goBack   = useCallback(() => setState((s) => ({ ...s, step: Math.max(1, s.step - 1) })), []);

  const handleSelectProfessional = useCallback((professional) => {
    setState((s) => ({ ...s, professional, date: null, time: null, step: 2 }));
  }, []);

  const handleSelectService = useCallback((service) => {
    setState((s) => ({ ...s, service, step: 3 }));
  }, []);

  const handleSelectDate = useCallback((date) => {
    setState((s) => ({ ...s, date, time: null, step: 4 }));
  }, []);

  const handleSelectTime = useCallback((time) => {
    setState((s) => ({ ...s, time, step: 5 }));
  }, []);

  /**
   * Llama al servicio de Firestore vía hook.
   * Si hay conflicto (slot tomado), vuelve al paso de horario.
   * Si hay error de red, saveError se muestra en StepConfirm.
   */
  const handleConfirm = useCallback(
    async (clientName, clientPhone) => {
      const { professional, service, date, time } = state;

      const result = await create({
        professionalId:   professional.id,
        professionalName: professional.name,
        serviceId:        service.id,
        serviceName:      service.name,
        servicePrice:     service.price,
        serviceIcon:      service.icon,
        date,
        time,
        clientName,
        clientPhone,
      });

      if (!result.success) {
        // Si el slot fue tomado en el último segundo, volvemos a elegir horario
        if (result.error?.includes('reservado')) {
          setState((s) => ({ ...s, time: null, step: 4 }));
        }
        // saveError ya está seteado en el hook → StepConfirm lo muestra
        return;
      }

      setState((s) => ({ ...s, confirmedAppointment: result.appointment, step: 6 }));
    },
    [state, create],
  );

  const handleNewBooking = useCallback(() => setState(INITIAL_STATE), []);

  const { step, professional, service, date, time, confirmedAppointment } = state;

  const canNavigateTo = (targetStep) => {
    if (targetStep === 1) return true;
    if (targetStep === 2) return !!professional;
    if (targetStep === 3) return !!professional && !!service;
    if (targetStep === 4) return !!professional && !!service && !!date;
    if (targetStep === 5) return !!professional && !!service && !!date && !!time;
    return false;
  };

  return (
    <section id="reservar" className="py-24 px-4 bg-zinc-900">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">
            Sistema de turnos online
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white mb-4">
            Reservar Turno
          </h2>
          <p className="text-zinc-400 max-w-md mx-auto">
            Elegí tu profesional, servicio, fecha y horario. Solo te pedimos tu nombre para confirmar.
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/60">

          {/* Stepper */}
          {step <= 5 && (
            <div className="px-6 pt-6 pb-0">
              <div className="flex items-center gap-0">
                {STEPS.map((s, idx) => {
                  const isCompleted = step > s.id;
                  const isCurrent   = step === s.id;
                  const isClickable = canNavigateTo(s.id) && step !== 6;

                  return (
                    <div key={s.id} className="flex items-center flex-1 last:flex-none">
                      <button
                        onClick={() => isClickable && goToStep(s.id)}
                        disabled={!isClickable || saving}
                        title={s.label}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-all ${
                          isCompleted
                            ? 'bg-amber-500 text-zinc-950 cursor-pointer'
                            : isCurrent
                            ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-400'
                            : 'bg-zinc-800 border border-zinc-700 text-zinc-600 cursor-default'
                        }`}
                      >
                        {isCompleted ? '✓' : s.id}
                      </button>

                      <span className={`hidden sm:block text-xs ml-1.5 font-medium transition-colors whitespace-nowrap ${
                        isCurrent ? 'text-amber-400' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'
                      }`}>
                        {s.label}
                      </span>

                      {idx < STEPS.length - 1 && (
                        <div className={`flex-1 h-px mx-2 transition-colors ${step > s.id ? 'bg-amber-500/50' : 'bg-zinc-800'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contenido del paso activo */}
          <div className="p-6 sm:p-8">
            {step === 1 && <StepProfessional selected={professional} onSelect={handleSelectProfessional} />}
            {step === 2 && <StepService selected={service} professional={professional} onSelect={handleSelectService} />}
            {step === 3 && <StepDate selected={date} professional={professional} service={service} onSelect={handleSelectDate} />}
            {step === 4 && <StepTime selected={time} professional={professional} service={service} date={date} onSelect={handleSelectTime} />}
            {step === 5 && (
              <StepConfirm
                professional={professional}
                service={service}
                date={date}
                time={time}
                onConfirm={handleConfirm}
                onBack={goBack}
                saving={saving}
                saveError={saveError}
              />
            )}
            {step === 6 && <StepSuccess appointment={confirmedAppointment} onNewBooking={handleNewBooking} />}
          </div>

          {/* Footer del wizard */}
          {step >= 1 && step <= 4 && (
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex items-center justify-between gap-4">
              <button
                onClick={goBack}
                disabled={step === 1}
                className="text-sm font-semibold text-zinc-500 hover:text-zinc-300 disabled:opacity-0 disabled:pointer-events-none transition-all"
              >
                ← Volver
              </button>
              <div className="text-xs text-zinc-600 hidden sm:block">
                {step === 1 && 'Seleccioná un profesional para continuar'}
                {step === 2 && 'Seleccioná un servicio para continuar'}
                {step === 3 && 'Seleccioná una fecha para continuar'}
                {step === 4 && 'Seleccioná un horario para continuar'}
              </div>
              <div className="text-xs text-zinc-600">Paso {step} de {STEPS.length}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
