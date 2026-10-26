/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center text-slate-950">
                <Layers className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                3D <span className="text-cyan-400">FACTORY</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Taller de manufactura aditiva y mecanizado láser. Fabricamos prototipos funcionales y lotes de producción con estándares industriales.
            </p>
          </div>

          {/* Col 2: Servicios */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Servicios
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#cotizador" className="hover:text-cyan-400 transition">Impresión 3D FDM / FFF</a></li>
              <li><a href="#cotizador" className="hover:text-cyan-400 transition">Corte Láser de Acrílico y MDF</a></li>
              <li><a href="#cotizador" className="hover:text-cyan-400 transition">Grabado Láser en Termos y Metales</a></li>
              <li><a href="#materiales" className="hover:text-cyan-400 transition">Prototipado Rápido y Series</a></li>
              <li><a href="#faq" className="hover:text-cyan-400 transition">Modelado CAD y Vectorizado</a></li>
            </ul>
          </div>

          {/* Col 3: Enlaces */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#capacidades" className="hover:text-cyan-400 transition">Capacidades y Maquinaria</a></li>
              <li><a href="#materiales" className="hover:text-cyan-400 transition">Catálogo de Materiales</a></li>
              <li><a href="#cotizador" className="hover:text-cyan-400 transition">Visor CAD Interactivo</a></li>
              <li><a href="#proceso" className="hover:text-cyan-400 transition">Garantía de Tolerancias</a></li>
              <li><a href="#faq" className="hover:text-cyan-400 transition">Preguntas Frecuentes</a></li>
            </ul>
          </div>

          {/* Col 4: Contacto */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Contacto y Envíos
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/5215577981060"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  WhatsApp: +52 1 55 7798 1060
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>contacto@3dfactory.mx</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Envíos a toda la República Mexicana</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} 3D Factory. Todos los derechos reservados.</p>
          <p>Tolerancias dimensionales garantizadas bajo norma ISO 2768.</p>
        </div>
      </div>
    </footer>
  );
};
