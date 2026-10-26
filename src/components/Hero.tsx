/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Box, Cpu, ShieldCheck, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-slate-950">
      {/* Subtle atmospheric backdrop gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[360px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[300px] bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Subtle kicker text */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 text-xs font-semibold mb-6 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Taller Especializado en Prototipado y Producción CNC
        </div>

        {/* Display Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto [text-wrap:balance]">
          Tus diseños convertidos en realidad en{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            3D FDM
          </span>{' '}
          y{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
            Corte Láser
          </span>
        </h1>

        {/* Value Proposition */}
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed [text-wrap:balance]">
          Sube tus modelos 3D (<span className="text-slate-200 font-medium">STL, OBJ, 3MF, STEP</span>) o planos vectoriales (<span className="text-slate-200 font-medium">DXF, SVG, PDF</span>), examínalos en nuestro visor interactivo y obtén una cotización instantánea.
        </p>

        {/* Action Controls */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#cotizador"
            className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-base transition shadow-xl shadow-cyan-500/20 flex items-center gap-2.5 active:scale-95"
          >
            <Box className="w-5 h-5" />
            <span>Cargar Archivo y Cotizar</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#materiales"
            className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-base transition active:scale-95"
          >
            Ver Catálogo de Materiales
          </a>
        </div>

        {/* Manufacturing Metrics Bar */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto border-t border-slate-800/80 pt-10 text-left">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Cpu className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Resolución FDM</span>
            </div>
            <p className="text-2xl font-black text-white tabular-nums">0.05 mm</p>
            <p className="text-xs text-slate-400 mt-0.5">Espesor mínimo de capa</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-2 text-orange-400 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Potencia Óptica</span>
            </div>
            <p className="text-2xl font-black text-orange-400 tabular-nums">100+ Watts</p>
            <p className="text-xs text-slate-400 mt-0.5">Tubo láser CO2 de alta velocidad</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Box className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Tiempos de Entrega</span>
            </div>
            <p className="text-2xl font-black text-emerald-400 tabular-nums">24 a 48 hrs</p>
            <p className="text-xs text-slate-400 mt-0.5">Despacho exprés a todo México</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-300 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Inspección de Calidad</span>
            </div>
            <p className="text-2xl font-black text-white tabular-nums">100%</p>
            <p className="text-xs text-slate-400 mt-0.5">Verificación dimensional de tolerancias</p>
          </div>
        </div>
      </div>
    </section>
  );
};
