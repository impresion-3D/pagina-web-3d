/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Upload, CheckCircle2, Cpu, PackageCheck } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Carga CAD o Plano Vectorial',
    description: 'Sube tu modelo STL, OBJ o plano DXF en el visor interactivo. Inspecciona la geometría, medidas y cotiza al instante.',
    icon: Upload,
  },
  {
    num: '02',
    title: 'Validación Técnica & Slicing',
    description: 'Nuestro equipo de ingenieros revisa el archivo, verifica espesor de paredes, tolerancias de ensamble y optimiza la orientación de capas.',
    icon: CheckCircle2,
  },
  {
    num: '03',
    title: 'Fabricación CNC Supervisada',
    description: 'Producimos tus piezas con perfiles térmicos controlados, filamentos deshumidificados y calibración milimétrica del haz láser.',
    icon: Cpu,
  },
  {
    num: '04',
    title: 'Control de Calidad & Despacho',
    description: 'Inspeccionamos cada pieza con vernier digital, retiramos soportes, limpiamos cantos y empacamos con protección para envío a domicilio.',
    icon: PackageCheck,
  },
];

export const ProcessSection: React.FC = () => {
  return (
    <section id="proceso" className="py-24 bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3">
            Garantía de Precisión
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Flujo de Trabajo Paso a Paso
          </h2>
          <p className="mt-3 text-slate-400 text-base leading-relaxed">
            Desde la pantalla de tu computadora hasta la pieza física terminada en tus manos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.num}
                className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-slate-700 font-mono tabular-nums">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                    Etapa {step.num}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
