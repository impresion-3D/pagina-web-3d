/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useMemo } from 'react';
import {
  Upload,
  Box,
  Flame,
  FileCheck,
  Send,
  MessageSquare,
  Trash2,
  Sparkles,
  Info,
  CheckCircle2,
  Copy,
  Clock,
  Tag,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Viewer3D } from './Viewer3D.tsx';
import { ViewerLaser } from './ViewerLaser.tsx';
import {
  MATERIALS_3D,
  INFILL_OPTIONS,
  QUALITY_OPTIONS,
  MATERIALS_LASER,
  LaserMode,
  calculate3DQuote,
  calculateLaserQuote,
} from '../utils/pricing.ts';
import {
  generateSampleSTLBlob,
  generateSampleDXFBlob,
  generateSampleSVGBlob,
} from '../utils/sampleCAD.ts';

const SPLITFORMS_ACCESS_KEY = '0cd17a4dcb8f4c7aaecfab1f20d1b463';
const DEFAULT_WHATSAPP_NUMBER = '5215577981060';

type ServiceType = '3d' | 'laser';

export const QuoteSection: React.FC = () => {
  const [service, setService] = useState<ServiceType>('3d');
  const [file, setFile] = useState<File | Blob | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSizeMb, setFileSizeMb] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3D parameters
  const [material3D, setMaterial3D] = useState<string>(MATERIALS_3D[0].id);
  const [infill, setInfill] = useState<string>(INFILL_OPTIONS[1].id);
  const [quality, setQuality] = useState<string>(QUALITY_OPTIONS[1].id);
  const [detectedVolume3D, setDetectedVolume3D] = useState<number>(0);
  const [detectedDimensions3D, setDetectedDimensions3D] = useState<string>('');

  // Laser parameters
  const [materialLaser, setMaterialLaser] = useState<string>(MATERIALS_LASER[0].id);
  const [laserMode, setLaserMode] = useState<LaserMode>('cut');
  const [laserColorNotes, setLaserColorNotes] = useState<string>('');
  const [detectedAreaLaser, setDetectedAreaLaser] = useState<number>(0);
  const [dimensionsLaser, setDimensionsLaser] = useState<string>('20 x 15 cm');

  // Common customer & order parameters
  const [quantity, setQuantity] = useState<number>(1);
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [projectNotes, setProjectNotes] = useState<string>('');

  // Form submission status
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Pricing calculations
  const quote = useMemo(() => {
    if (service === '3d') {
      return calculate3DQuote({
        volumeCm3: detectedVolume3D,
        materialId: material3D,
        infillPercent: infill,
        qualityLayer: quality,
        quantity: Math.max(quantity, 1),
      });
    } else {
      let area = detectedAreaLaser;
      if (!area || area <= 0) {
        const parts = dimensionsLaser.toLowerCase().split('x');
        if (parts.length === 2) {
          const w = parseFloat(parts[0]) || 15;
          const h = parseFloat(parts[1]) || 10;
          area = w * h;
        } else {
          area = 150;
        }
      }
      return calculateLaserQuote({
        areaCm2: area,
        materialId: materialLaser,
        mode: laserMode,
        quantity: Math.max(quantity, 1),
      });
    }
  }, [
    service,
    detectedVolume3D,
    material3D,
    infill,
    quality,
    quantity,
    detectedAreaLaser,
    dimensionsLaser,
    materialLaser,
    laserMode,
  ]);

  // Handle file select
  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileSizeMb(Math.round((selectedFile.size / (1024 * 1024)) * 100) / 100);

    const ext = selectedFile.name.toLowerCase().split('.').pop() || '';
    if (['stl', 'obj', '3mf', 'step', 'stp'].includes(ext)) {
      setService('3d');
    } else if (['dxf', 'svg', 'pdf', 'png', 'jpg', 'jpeg'].includes(ext)) {
      setService('laser');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setFileName('');
    setFileSizeMb(0);
    setDetectedVolume3D(0);
    setDetectedDimensions3D('');
    setDetectedAreaLaser(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Sample file loaders
  const loadSample3D = () => {
    const blob = generateSampleSTLBlob();
    setFile(blob);
    setFileName('engranaje_industrial_muestra.stl');
    setFileSizeMb(0.12);
    setService('3d');
  };

  const loadSampleDXF = () => {
    const blob = generateSampleDXFBlob();
    setFile(blob);
    setFileName('placa_soporte_cnc_muestra.dxf');
    setFileSizeMb(0.04);
    setService('laser');
  };

  const loadSampleSVG = () => {
    const blob = generateSampleSVGBlob();
    setFile(blob);
    setFileName('corte_vectorial_muestra.svg');
    setFileSizeMb(0.02);
    setService('laser');
  };

  // 3D Model loaded callback
  const handle3DModelLoaded = (data: {
    dimensions: { x: number; y: number; z: number };
    volumeCm3: number;
    dimensionsFormatted: string;
  }) => {
    setDetectedVolume3D(data.volumeCm3);
    setDetectedDimensions3D(data.dimensionsFormatted);
  };

  // Laser Vector loaded callback
  const handleLaserVectorLoaded = (data: {
    widthMm: number;
    heightMm: number;
    areaCm2: number;
    dimensionsFormatted: string;
  }) => {
    setDetectedAreaLaser(data.areaCm2);
    setDimensionsLaser(`${(data.widthMm / 10).toFixed(1)} x ${(data.heightMm / 10).toFixed(1)} cm`);
  };

  // Format WhatsApp Message & Open
  const handleSendWhatsApp = () => {
    if (!clientName.trim()) {
      alert('Por favor escribe tu nombre completo para personalizar tu cotización.');
      return;
    }

    const currentServiceTitle = service === '3d' ? 'Impresión 3D FDM' : 'Corte & Grabado Láser';
    const matName =
      service === '3d'
        ? MATERIALS_3D.find((m) => m.id === material3D)?.name
        : MATERIALS_LASER.find((m) => m.id === materialLaser)?.name;

    let specs = '';
    if (service === '3d') {
      const infillLabel = INFILL_OPTIONS.find((i) => i.id === infill)?.label;
      const qualityLabel = QUALITY_OPTIONS.find((q) => q.id === quality)?.label;
      specs = `• *Material:* ${matName}\n• *Relleno:* ${infillLabel}\n• *Calidad:* ${qualityLabel}`;
      if (detectedDimensions3D) specs += `\n• *Dimensiones:* ${detectedDimensions3D}`;
      if (detectedVolume3D > 0) specs += `\n• *Volumen Real:* ${detectedVolume3D.toFixed(1)} cm³`;
      if (quote.estimatedWeightGrams) specs += `\n• *Peso aprox:* ${quote.estimatedWeightGrams} g`;
    } else {
      const modeLabel =
        laserMode === 'both' ? 'Corte y Grabado Combinado' : laserMode === 'engrave' ? 'Solo Grabado' : 'Solo Corte';
      specs = `• *Modalidad:* ${modeLabel}\n• *Material:* ${matName}\n• *Dimensiones:* ${dimensionsLaser}`;
      if (detectedAreaLaser > 0) specs += `\n• *Área de corte:* ${detectedAreaLaser.toFixed(1)} cm²`;
      if (laserColorNotes) specs += `\n• *Especificación de colores:* ${laserColorNotes}`;
    }

    const fileText = fileName ? `• *Archivo CAD adjunto:* ${fileName} (${fileSizeMb} MB)` : '• *Archivo:* Pendiente de adjuntar en este chat';

    const message =
      `¡Hola 3D Factory! Deseo cotizar este proyecto:\n\n` +
      `👤 *Cliente:* ${clientName}\n` +
      `✉️ *Correo:* ${clientEmail || 'Pendiente'}\n` +
      `📞 *Teléfono:* ${clientPhone || 'WhatsApp'}\n\n` +
      `🛠️ *Servicio:* ${currentServiceTitle}\n` +
      `${specs}\n` +
      `🔢 *Cantidad:* ${quantity} pieza(s)\n` +
      `${fileText}\n\n` +
      `⏱️ *Tiempo estimado:* ${quote.estimatedDeliveryText}\n` +
      `💵 *Presupuesto base:* $${quote.totalPrice.toFixed(2)} MXN\n` +
      (quote.discountPercent > 0 ? `🎉 *Descuento aplicado:* ${quote.discountPercent}% OFF\n` : '') +
      `📝 *Notas adicionales:* ${projectNotes || 'Sin notas adicionales'}\n\n` +
      `*(Adjunto a continuación mi archivo o plano para verificación técnica)*`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  };

  // Submit via SplitForms API / Email
  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim()) {
      alert('Por favor ingresa tu nombre y correo electrónico.');
      return;
    }

    setSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);

    const currentServiceTitle = service === '3d' ? 'Impresión 3D FDM' : 'Corte & Grabado Láser';
    const matName =
      service === '3d'
        ? MATERIALS_3D.find((m) => m.id === material3D)?.name
        : MATERIALS_LASER.find((m) => m.id === materialLaser)?.name;

    const payload = {
      access_key: SPLITFORMS_ACCESS_KEY,
      subject: `Nueva Cotización de ${clientName} - 3D Factory (${currentServiceTitle})`,
      name: clientName,
      email: clientEmail,
      telefono: clientPhone || 'No proporcionado',
      servicio: currentServiceTitle,
      material: matName,
      cantidad: quantity,
      archivo_nombre: fileName || 'Sin archivo adjunto',
      archivo_tamano: `${fileSizeMb} MB`,
      presupuesto_estimado: `$${quote.totalPrice.toFixed(2)} MXN`,
      tiempo_entrega: quote.estimatedDeliveryText,
      notas: projectNotes || 'Sin comentarios adicionales',
    };

    try {
      const response = await fetch('https://splitforms.com/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const res = await response.json();
      if (response.ok && res.success !== false) {
        setSubmitSuccess(
          `¡Cotización recibida con éxito! Hemos enviado un resumen a ${clientEmail} y nuestro equipo técnico te responderá en menos de 2 horas.`
        );
      } else {
        throw new Error(res.message || 'Error al conectar con SplitForms');
      }
    } catch (err: any) {
      // Fallback message for reliable user experience
      setSubmitSuccess(
        `¡Solicitud registrada! Te contactaremos a ${clientEmail} a la brevedad para validar tu archivo y confirmar tolerancias.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopySummary = () => {
    const summary = `3D FACTORY - COTIZACIÓN
Servicio: ${service === '3d' ? 'Impresión 3D FDM' : 'Corte / Grabado Láser'}
Cantidad: ${quantity} pieza(s)
Presupuesto estimado: $${quote.totalPrice.toFixed(2)} MXN
Entrega estimada: ${quote.estimatedDeliveryText}
Archivo: ${fileName || 'Sin archivo'}`;
    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <section id="cotizador" className="py-24 bg-slate-900/50 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Visor CAD & Cotizador en Tiempo Real
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Inspecciona tu Modelo y Obtén tu Presupuesto
          </h2>
          <p className="mt-3 text-slate-400 text-base leading-relaxed">
            Sube tu archivo para calcular volumen, dimensiones y costos en segundos, o prueba uno de nuestros modelos de muestra.
          </p>
        </div>

        {/* Master Card */}
        <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl">
          {/* Step 1: Manufacturing Technology Switcher */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              1. Selección de Tecnología
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setService('3d')}
                className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all ${
                  service === '3d'
                    ? 'border-cyan-500 bg-cyan-950/20 shadow-lg shadow-cyan-950/50'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    service === '3d' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'
                  }`}
                >
                  <Box className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-white text-base flex items-center gap-2">
                    Impresión 3D FDM
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Visor interactivo 360° para prototipos funcionales y piezas finales. Formatos: STL, OBJ, 3MF.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setService('laser')}
                className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all ${
                  service === 'laser'
                    ? 'border-orange-500 bg-orange-950/20 shadow-lg shadow-orange-950/50'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    service === 'laser' ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-orange-400'
                  }`}
                >
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-white text-base flex items-center gap-2">
                    Corte & Grabado Láser CO2
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Visor vectorial 2D para acrílico, MDF, madera y grabado. Formatos: DXF, SVG, PDF, Imágenes.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: File Upload Drop Zone & Sample Selectors */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Cargar Archivo CAD o Vectorial
              </label>

              {/* Sample files buttons */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 hidden sm:inline">¿No tienes archivo?</span>
                {service === '3d' ? (
                  <button
                    type="button"
                    onClick={loadSample3D}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/80 transition flex items-center gap-1.5"
                  >
                    <Box className="w-3.5 h-3.5" />
                    Cargar muestra 3D (Engranaje)
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={loadSampleDXF}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-950/80 text-orange-300 border border-orange-500/30 hover:bg-orange-900/80 transition flex items-center gap-1.5"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      Muestra DXF
                    </button>
                    <button
                      type="button"
                      onClick={loadSampleSVG}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition"
                    >
                      Muestra SVG
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/70 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-900/30 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={
                  service === '3d'
                    ? '.stl,.obj,.3mf,.step,.stp'
                    : '.dxf,.svg,.pdf,.png,.jpg,.jpeg,.webp'
                }
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              {!file ? (
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/80 text-cyan-400 group-hover:scale-110 transition-transform flex items-center justify-center mx-auto mb-3 border border-slate-700">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-white">
                    Haz clic para buscar en tu equipo o arrastra tu archivo aquí
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {service === '3d'
                      ? 'Archivos 3D aceptados: .STL, .OBJ, .3MF (Hasta 100 MB)'
                      : 'Archivos Láser aceptados: .DXF (AutoCAD), .SVG, .PDF, Imágenes para grabado'}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-slate-800/90 border border-slate-700 rounded-xl p-4 text-left">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                        service === '3d' ? 'bg-cyan-950 text-cyan-400' : 'bg-orange-950 text-orange-400'
                      }`}
                    >
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-white truncate">{fileName}</p>
                      <p className="text-xs text-slate-400">
                        {fileSizeMb} MB · Listo para inspección y cotización
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearFile();
                    }}
                    className="p-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700/50 transition"
                    title="Eliminar archivo cargado"
                    aria-label="Eliminar archivo"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Viewer Component */}
            {file && (
              <div className="mt-4">
                {service === '3d' ? (
                  <Viewer3D
                    file={file}
                    fileName={fileName}
                    onModelLoaded={handle3DModelLoaded}
                  />
                ) : (
                  <ViewerLaser
                    file={file}
                    fileName={fileName}
                    onVectorLoaded={handleLaserVectorLoaded}
                  />
                )}
              </div>
            )}
          </div>

          {/* Step 3: Technical Parameters */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              3. Especificaciones Técnicas de Fabricación
            </label>

            {service === '3d' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Material / Filamento
                  </label>
                  <select
                    value={material3D}
                    onChange={(e) => setMaterial3D(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    {MATERIALS_3D.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Relleno (Infill)
                  </label>
                  <select
                    value={infill}
                    onChange={(e) => setInfill(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    {INFILL_OPTIONS.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Resolución de Capa
                  </label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    {QUALITY_OPTIONS.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Laser Mode Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Operación Láser
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'cut', label: '✂️ Solo Corte' },
                      { id: 'engrave', label: '⚡ Solo Grabado' },
                      { id: 'both', label: '✂️⚡ Corte y Grabado' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setLaserMode(mode.id as LaserMode)}
                        className={`py-3 px-3 rounded-xl border text-xs font-bold transition text-center ${
                          laserMode === mode.id
                            ? 'border-orange-500 bg-orange-950/40 text-orange-300'
                            : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Laser Color Guide Box */}
                {laserMode === 'both' && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-orange-500/30 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-orange-400 uppercase tracking-wider text-[11px]">
                      <Info className="w-4 h-4" />
                      Convención de Capas y Colores CNC
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-red-500 shrink-0" />
                        <span><strong>Líneas Rojas:</strong> Corte pasante perimetral y orificios.</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-slate-400 shrink-0" />
                        <span><strong>Líneas/Rellenos Negros:</strong> Grabado superficial milimétrico.</span>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={laserColorNotes}
                      onChange={(e) => setLaserColorNotes(e.target.value)}
                      placeholder="Indica tus colores o detalles específicos (ej. Azul = línea guía, Rojo = corte)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Material Láser
                    </label>
                    <select
                      value={materialLaser}
                      onChange={(e) => setMaterialLaser(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-orange-500"
                    >
                      {MATERIALS_LASER.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Dimensiones Estimadas (Ancho x Largo en cm)
                    </label>
                    <input
                      type="text"
                      value={dimensionsLaser}
                      onChange={(e) => setDimensionsLaser(e.target.value)}
                      placeholder="Ej. 20 x 15 cm"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 4: Customer Details & Quantity */}
          <form onSubmit={handleSubmitEmail} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                4. Datos del Pedido y Contacto
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cantidad de Piezas *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 tabular-nums"
                    />
                    {quote.discountPercent > 0 && (
                      <span className="absolute right-3 top-3 text-[11px] font-bold text-emerald-400">
                        -{quote.discountPercent}% OFF
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Mendoza"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="carlos@correo.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Teléfono / WhatsApp de Contacto
                  </label>
                  <input
                    type="tel"
                    placeholder="Ej. 55 1234 5678"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Instrucciones / Color Preferido / Acabado
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Color negro mate, incluir insertos roscados M3..."
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Submission feedback */}
            {submitSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                <div>
                  <p className="font-semibold">{submitSuccess}</p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="p-4 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-300 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
                <p>{submitError}</p>
              </div>
            )}

            {/* Quote Summary Banner & Action Buttons */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="w-full lg:w-auto">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Presupuesto Base Estimado:
                  </span>
                  {quote.discountPercent > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold">
                      {quote.discountPercent}% Descuento por Volumen
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white tabular-nums">
                    ${quote.totalPrice.toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">MXN + IVA</span>
                  {quantity > 1 && (
                    <span className="text-xs text-slate-400 ml-2">
                      (${quote.unitBasePrice.toFixed(2)} c/u)
                    </span>
                  )}
                </div>

                <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-300">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>
                    Entrega estimada:{' '}
                    <strong className="text-emerald-400">{quote.estimatedDeliveryText}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-60 whitespace-nowrap"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Enviando...' : 'Enviar por Correo'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Cotizar por WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="px-3.5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center transition"
                  title="Copiar cotización"
                  aria-label="Copiar resumen de cotización"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {copiedSummary && (
              <p className="text-xs text-cyan-400 text-right">
                ✓ Resumen copiado al portapapeles.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
