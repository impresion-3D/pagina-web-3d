/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip prompt */}
      <div
        className={`hidden sm:flex mr-3 bg-slate-900/95 text-white text-xs px-3.5 py-2 rounded-xl shadow-2xl border border-slate-700/80 backdrop-blur-md items-center gap-2 transition-all ${
          showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>¿Dudas con tu plano o modelo 3D? <strong>Chatea con un asesor</strong></span>
      </div>

      <a
        href="https://wa.me/5215577981060?text=%C2%A1Hola%203D%20Factory!%20Tengo%20una%20duda%20sobre%20mi%20dise%C3%B1o%20o%20archivo%20CAD..."
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full flex items-center justify-center text-2xl shadow-2xl shadow-emerald-950 transition-all transform hover:scale-105 active:scale-95"
        aria-label="Contactar por WhatsApp a 3D Factory"
      >
        <MessageSquare className="w-7 h-7 text-white fill-white" />
      </a>
    </div>
  );
};
