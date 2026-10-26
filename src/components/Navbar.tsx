/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element + crisp icon) */}
        <a href="#" className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white leading-none">
              3D <span className="text-cyan-400">FACTORY</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
              Manufactura Digital
            </span>
          </div>
        </a>

        {/* Zone 2: Clean 4–5 single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a href="#capacidades" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Capacidades
          </a>
          <a href="#materiales" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Materiales
          </a>
          <a href="#cotizador" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Visor CAD & Cotizador
          </a>
          <a href="#proceso" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Proceso
          </a>
          <a href="#faq" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            Preguntas Frecuentes
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <a
            href="#cotizador"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20 whitespace-nowrap shrink-0"
          >
            Subir Archivo
          </a>
        </div>

        {/* Mobile menu toggle button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-4 space-y-3">
          <a
            href="#capacidades"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-cyan-400 text-sm font-medium py-1"
          >
            Capacidades
          </a>
          <a
            href="#materiales"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-cyan-400 text-sm font-medium py-1"
          >
            Materiales
          </a>
          <a
            href="#cotizador"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-cyan-400 text-sm font-medium py-1"
          >
            Visor CAD & Cotizador
          </a>
          <a
            href="#proceso"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-cyan-400 text-sm font-medium py-1"
          >
            Proceso
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-cyan-400 text-sm font-medium py-1"
          >
            Preguntas Frecuentes
          </a>
          <a
            href="#cotizador"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider"
          >
            Subir Archivo & Cotizar
          </a>
        </div>
      )}
    </header>
  );
};
