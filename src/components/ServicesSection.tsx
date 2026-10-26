/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Box, Flame, CheckCircle, Crosshair, Wrench, Layers } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  return (
    <section id="capacidades" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Infraestructura y Maquinaria
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Capacidades de Fabricación Digital
          </h2>
          <p className="mt-3 text-slate-400 text-base leading-relaxed">
            Parque de máquinas calibradas con precisión micrométrica para proyectos industriales, prototipos de ingeniería y producciones en serie.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1: 3D FDM */}
          <div className="bg-slate-900/60 rounded-3xl p-8 border border-slate-800/90 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 text-cyan-400 flex items-center justify-center text-2xl mb-6 border border-cyan-500/30">
                <Box className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Impresión 3D FDM / FFF Industrial
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Manufactura aditiva por filamento fundido con control térmico de cámara cerrada. Diseñado para prototipos funcionales, ensambles mecánicos con tolerancias estrictas, carcasas electrónicas y herramentales de manufactura.
              </p>

              <div className="space-y-3.5 mb-8 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Volumen útil máximo:</strong> Hasta 350 x 350 x 400 mm en una sola pieza continua.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Formatos admitidos:</strong> STL, OBJ, 3MF, STEP, STP, GLB y GLTF.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Materiales de ingeniería:</strong> PLA+, PETG, ABS, ASA, TPU Flexible 95A y Nylon reforzado con Fibra de Carbono.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Post-procesamiento:</strong> Inserción de roscas térmicas M2 a M8, ensamble de componentes y pulido.</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Tolerancia dimensional ±0.15 mm</span>
              <a
                href="#cotizador"
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
              >
                Configurar pieza 3D &rarr;
              </a>
            </div>
          </div>

          {/* Card 2: Laser Cutting & Engraving */}
          <div className="bg-slate-900/60 rounded-3xl p-8 border border-slate-800/90 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-orange-950/80 text-orange-400 flex items-center justify-center text-2xl mb-6 border border-orange-500/30">
                <Flame className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Corte y Grabado Láser CO2
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Mecanizado láser de alta potencia y haz focalizado para bordes pulidos y grabados milimétricos. Ideal para acrílicos de señalización, maquetas arquitectónicas, empaques, tableros de control y personalización.
              </p>

              <div className="space-y-3.5 mb-8 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span><strong>Área máxima de bancada:</strong> Hasta 1300 x 900 mm para láminas completas.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span><strong>Formatos vectoriales:</strong> DXF (AutoCAD), SVG, PDF vectorial, AI e imágenes raster para grabado.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span><strong>Materiales aptos:</strong> Acrílico cristal/color/espejo (2 a 10 mm), MDF, Triplay de madera, Cuero y Cartón.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span><strong>Grabado sobre artículos propios:</strong> Termos de acero inoxidable, navajas, madera y cuero.</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Ancho de corte (kerf) &lt; 0.2 mm</span>
              <a
                href="#cotizador"
                className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1.5"
              >
                Configurar corte láser &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
