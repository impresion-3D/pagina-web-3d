/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, Thermometer, Shield, Sparkles, Check } from 'lucide-react';

interface MaterialSpec {
  id: string;
  category: '3d' | 'laser';
  name: string;
  subtitle: string;
  maxTemp?: string;
  resistance: string;
  applications: string;
  finish: string;
  accent: 'cyan' | 'orange';
}

const ALL_MATERIALS: MaterialSpec[] = [
  {
    id: 'pla',
    category: '3d',
    name: 'PLA / PLA+ de Alta Precisión',
    subtitle: 'El estándar de prototipado rápido',
    maxTemp: '55 °C',
    resistance: 'Rigidez media / Excelente acabado cosmético',
    applications: 'Maquetas de arquitectura, figuras decorativas, prototipos dimensionales y carcasas.',
    finish: 'Mate o satinado de alta resolución, fácil de lijar y pintar.',
    accent: 'cyan',
  },
  {
    id: 'petg',
    category: '3d',
    name: 'PETG Técnico',
    subtitle: 'Resistencia química y a la intemperie',
    maxTemp: '75 °C',
    resistance: 'Alta resistencia al impacto y humedad / Protección UV',
    applications: 'Soportes de montaje, partes para exteriores, contenedores estancos y drones.',
    finish: 'Brillante o translúcido, gran adhesión entre capas.',
    accent: 'cyan',
  },
  {
    id: 'abs_asa',
    category: '3d',
    name: 'ABS / ASA Grado Industrial',
    subtitle: 'Resistencia térmica y automotriz',
    maxTemp: '95 °C',
    resistance: 'Termorresistente / Resiste luz solar prolongada sin amarillear',
    applications: 'Piezas bajo cofre automotriz, gabinetes electrónicos y herramentales de taller.',
    finish: 'Superficie lisa pulible con vapor de acetona.',
    accent: 'cyan',
  },
  {
    id: 'tpu',
    category: '3d',
    name: 'TPU Flexible 95A',
    subtitle: 'Polímero elástico tipo goma',
    maxTemp: '80 °C',
    resistance: 'Amortiguación de impactos, resistente a aceites y grasas',
    applications: 'Empaques herméticos, amortiguadores de vibración, llantas de robótica y fundas.',
    finish: 'Goma flexible antideslizante con memoria de forma.',
    accent: 'cyan',
  },
  {
    id: 'carbon_nylon',
    category: '3d',
    name: 'Nylon Fibra de Carbono (PA-CF)',
    subtitle: 'Material estructural compuesto',
    maxTemp: '150 °C',
    resistance: 'Máxima resistencia mecánica y rigidez extrema aeroespacial',
    applications: 'Brazo robótico, engranes de alta carga, componentes de carreras.',
    finish: 'Negro mate texturizado de apariencia profesional.',
    accent: 'cyan',
  },
  {
    id: 'mdf',
    category: 'laser',
    name: 'MDF de 3 mm y 6 mm',
    subtitle: 'Madera compactada para corte limpio',
    resistance: 'Excelente estabilidad dimensional / Fácil de ensamblar',
    applications: 'Cajas con ensamble tipo diente de perro, maquetas, letreros y rompecabezas.',
    finish: 'Superficie lisa lista para barniz, pintura o sellador.',
    accent: 'orange',
  },
  {
    id: 'acrylic_clear',
    category: 'laser',
    name: 'Acrílico Cristal 3 mm a 10 mm',
    subtitle: 'Transparencia óptica del 92%',
    resistance: 'Resistente a la intemperie, brillo permanente',
    applications: 'Vitrinas, letreros luminosos con retroiluminación LED, displays y guardas.',
    finish: 'Cantos pulidos al fuego por el calor del láser.',
    accent: 'orange',
  },
  {
    id: 'acrylic_color',
    category: 'laser',
    name: 'Acrílico Color & Espejo',
    subtitle: 'Acabados de lujo piano o reflejante',
    resistance: 'Inalterable al paso del tiempo / Alto impacto visual',
    applications: 'Señalética corporativa, logotipos tridimensionales, trofeos y reconocimientos.',
    finish: 'Negro piano brillante, blanco puro o espejo oro/plata.',
    accent: 'orange',
  },
  {
    id: 'wood_plywood',
    category: 'laser',
    name: 'Triplay de Pino y Caobilla',
    subtitle: 'Madera natural con veta vista',
    resistance: 'Estructural ligera / Veta continua',
    applications: 'Artículos artesanales, portavasos, portarretratos, cajas finas y souvenirs.',
    finish: 'Grabados en tonos café caramelo con olor a madera natural.',
    accent: 'orange',
  },
  {
    id: 'metal_engrave',
    category: 'laser',
    name: 'Grabado en Termos / Acero',
    subtitle: 'Personalización milimétrica',
    resistance: 'Grabado permanente indeleble que no se cae con el lavado',
    applications: 'Termos Yeti/Stanley, cantimploras, navajas, herramientas y placas de identificación.',
    finish: 'Contraste nítido metálico de alta definición.',
    accent: 'orange',
  },
];

export const MaterialsSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | '3d' | 'laser'>('all');

  const filtered = ALL_MATERIALS.filter((m) => {
    if (filter === 'all') return true;
    return m.category === filter;
  });

  return (
    <section id="materiales" className="py-24 bg-slate-900/40 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Catálogo Certificado
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Materiales y Propiedades Técnicas
          </h2>
          <p className="mt-3 text-slate-400 text-base leading-relaxed">
            Trabajamos con polímeros y sustratos de grado técnico seleccionados para garantizar tolerancias y durabilidad.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({ALL_MATERIALS.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('3d')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filter === '3d'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Impresión 3D FDM
            </button>
            <button
              type="button"
              onClick={() => setFilter('laser')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filter === 'laser'
                  ? 'bg-orange-950 text-orange-300 border border-orange-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Corte & Grabado Láser
            </button>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((mat) => (
            <div
              key={mat.id}
              className="bg-slate-950 rounded-2xl p-6 border border-slate-800/90 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      mat.accent === 'cyan' ? 'text-cyan-400' : 'text-orange-400'
                    }`}
                  >
                    {mat.category === '3d' ? '3D FDM' : 'Láser CO2'}
                  </span>
                  {mat.maxTemp && (
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Thermometer className="w-3.5 h-3.5" />
                      {mat.maxTemp}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{mat.name}</h3>
                <p className="text-xs text-slate-400 mb-4">{mat.subtitle}</p>

                <div className="space-y-2 text-xs text-slate-300 border-t border-slate-850 pt-4">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block font-semibold">Resistencia:</span>
                    <span>{mat.resistance}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block font-semibold">Aplicaciones:</span>
                    <span>{mat.applications}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 block font-semibold">Acabado:</span>
                    <span className="text-slate-400">{mat.finish}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-end">
                <a
                  href="#cotizador"
                  className={`text-xs font-semibold transition ${
                    mat.accent === 'cyan'
                      ? 'text-cyan-400 hover:text-cyan-300'
                      : 'text-orange-400 hover:text-orange-300'
                  }`}
                >
                  Cotizar en {mat.name.split(' ')[0]} &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
