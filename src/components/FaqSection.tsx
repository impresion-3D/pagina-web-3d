/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: '¿Qué formatos de archivo puedo inspeccionar en vivo en el visor?',
    a: 'Para Impresión 3D puedes visualizar e inspeccionar modelos en formato .STL (binario o ASCII), .OBJ y .3MF con cálculo automático de volumen cúbico y dimensiones. Para Corte y Grabado Láser admitimos planos .DXF (AutoCAD R12/2000), .SVG vectoriales escalables, documentos .PDF de ingeniería e imágenes (.PNG, .JPG) para grabado superficial.',
  },
  {
    q: '¿Qué hago si no tengo el archivo CAD 3D o plano vectorial listo?',
    a: '¡No te preocupes! Si cuentas con un boceto a mano alzada con cotas, una muestra física rota que necesites replicar o una idea, nuestro equipo de ingeniería realiza el modelado 3D CAD paramétrico y vectorizado profesional. Puedes escribirnos directamente por WhatsApp para coordinar el diseño.',
  },
  {
    q: '¿Cuál es el pedido mínimo y aplican descuentos por volumen?',
    a: 'Fabricamos desde 1 sola pieza unitaria (ideal para inventores, estudiantes y prototipado ágil) hasta lotes de cientos de piezas. Nuestro cotizador aplica automáticamente descuentos: 8% OFF a partir de 5 piezas, 15% OFF a partir de 20 piezas, y 20% OFF para lotes de 50 o más unidades.',
  },
  {
    q: '¿Cómo debo configurar mi plano para diferenciar corte y grabado láser?',
    a: 'La convención estándar es trazar en color ROJO las líneas de corte pasante exterior y orificios internos, y en color NEGRO las geometrías o rellenos destinados a grabado superficial. Si utilizaste otros colores en Illustrator o AutoCAD, puedes detallarlo en el campo de notas del cotizador.',
  },
  {
    q: '¿Qué tolerancias dimensionales garantizan en ensambles mecánicos?',
    a: 'En impresión 3D FDM manejamos tolerancias típicas de ±0.15 mm a ±0.2 mm según la orientación de capa y geometría. Para ensambles con roscas, recomendamos holguras de 0.25 mm a 0.35 mm. En corte láser, la precisión del haz es inferior a 0.1 mm con cantos rectos y limpios.',
  },
  {
    q: '¿Cuáles son los tiempos de entrega y envían a todo el país?',
    a: 'Para piezas individuales y prototipos exprés, el tiempo de manufactura es de 24 a 48 horas hábiles. Para pedidos de lote mediano toma de 2 a 4 días. Realizamos envíos protegidos a toda la República Mexicana por paqueterías líderes (DHL, FedEx, Estafeta) con número de rastreo.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-slate-900/60 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            Resolvemos tus Dudas
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="mt-3 text-slate-400 text-base leading-relaxed">
            Todo lo que necesitas saber antes de encargar la fabricación de tu proyecto.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm hover:text-cyan-300 transition"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
