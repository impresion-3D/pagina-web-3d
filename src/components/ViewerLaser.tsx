/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import DxfParser from 'dxf-parser';
import { Plus, Minus, Maximize2, RefreshCw, FileText, Image as ImageIcon } from 'lucide-react';

interface ViewerLaserProps {
  file: File | Blob | null;
  fileName?: string;
  onVectorLoaded?: (stats: {
    widthMm: number;
    heightMm: number;
    areaCm2: number;
    dimensionsFormatted: string;
  }) => void;
}

export const ViewerLaser: React.FC<ViewerLaserProps> = ({
  file,
  fileName = 'plano.dxf',
  onVectorLoaded,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [viewerFormat, setViewerFormat] = useState<'dxf' | 'svg' | 'pdf' | 'image'>('dxf');
  const [svgContent, setSvgContent] = useState<string>('');
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [imgBlobUrl, setImgBlobUrl] = useState<string | null>(null);

  // DXF Pan and Zoom state
  const dxfDataRef = useRef<any>(null);
  const transformRef = useRef({ scale: 1, panX: 0, panY: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const [stats, setStats] = useState({
    widthMm: 0,
    heightMm: 0,
    areaCm2: 0,
  });

  const getExt = (name: string) => name.toLowerCase().split('.').pop() || '';

  // Process File whenever it changes
  useEffect(() => {
    if (!file) return;
    const ext = getExt(fileName);
    setError(null);
    setLoading(true);

    if (ext === 'dxf') {
      setViewerFormat('dxf');
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          let parsed: any = null;
          try {
            const parser = new DxfParser();
            parsed = parser.parseSync(text);
          } catch (parseErr) {
            parsed = parseSimpleDxf(text);
          }

          if (!parsed || !parsed.entities || parsed.entities.length === 0) {
            throw new Error('Sin entidades vectoriales detectadas.');
          }

          dxfDataRef.current = parsed;
          resetDxfView();
          setLoading(false);
        } catch (err: any) {
          setError('No se pudo analizar el archivo DXF. Verifica que esté en formato AutoCAD DXF estándar.');
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setError('Error al leer el archivo.');
        setLoading(false);
      };
    } else if (ext === 'svg') {
      setViewerFormat('svg');
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setSvgContent(text);
        
        // Approximate dimensions from viewBox
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');
        let w = 150;
        let h = 100;
        if (svgEl) {
          const vb = svgEl.getAttribute('viewBox');
          if (vb) {
            const parts = vb.split(/[\s,]+/).map(Number);
            if (parts.length >= 4) {
              w = parts[2];
              h = parts[3];
            }
          }
        }
        const area = (w * h) / 100;
        setStats({ widthMm: Math.round(w), heightMm: Math.round(h), areaCm2: Math.round(area) });
        if (onVectorLoaded) {
          onVectorLoaded({
            widthMm: w,
            heightMm: h,
            areaCm2: area,
            dimensionsFormatted: `${w.toFixed(0)} x ${h.toFixed(0)} mm`,
          });
        }
        setLoading(false);
      };
    } else if (ext === 'pdf') {
      setViewerFormat('pdf');
      const url = URL.createObjectURL(file);
      setPdfBlobUrl(url);
      setStats({ widthMm: 297, heightMm: 210, areaCm2: 623 });
      if (onVectorLoaded) {
        onVectorLoaded({
          widthMm: 297,
          heightMm: 210,
          areaCm2: 623,
          dimensionsFormatted: 'Documento Vectorial CAD PDF',
        });
      }
      setLoading(false);
    } else if (['png', 'jpg', 'jpeg', 'webp', 'bmp'].includes(ext)) {
      setViewerFormat('image');
      const url = URL.createObjectURL(file);
      setImgBlobUrl(url);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const wMm = Math.round(img.naturalWidth * 0.264583);
        const hMm = Math.round(img.naturalHeight * 0.264583);
        const area = Math.round((wMm * hMm) / 100);
        setStats({ widthMm: wMm, heightMm: hMm, areaCm2: area });
        if (onVectorLoaded) {
          onVectorLoaded({
            widthMm: wMm,
            heightMm: hMm,
            areaCm2: area,
            dimensionsFormatted: `${wMm} x ${hMm} mm (${img.naturalWidth}x${img.naturalHeight}px)`,
          });
        }
        setLoading(false);
      };
    } else {
      setError('Formato no soportado para previsualización directa.');
      setLoading(false);
    }

    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
      if (imgBlobUrl) URL.revokeObjectURL(imgBlobUrl);
    };
  }, [file, fileName]);

  const resetDxfView = () => {
    const canvas = canvasRef.current;
    const dxf = dxfDataRef.current;
    if (!canvas || !dxf) return;

    const bounds = getDxfBounds(dxf);
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth || 600;
    const h = canvas.clientHeight || 380;

    canvas.width = w * dpr;
    canvas.height = h * dpr;

    const dxfW = bounds.maxX - bounds.minX || 10;
    const dxfH = bounds.maxY - bounds.minY || 10;

    const scaleX = (w - 80) / dxfW;
    const scaleY = (h - 80) / dxfH;
    const scale = Math.min(scaleX, scaleY);

    const panX = (w - dxfW * scale) / 2 - bounds.minX * scale;
    const panY = (h - dxfH * scale) / 2 + bounds.maxY * scale;

    transformRef.current = { scale, panX, panY };

    const area = (dxfW * dxfH) / 100;
    setStats({
      widthMm: Math.round(dxfW * 10) / 10,
      heightMm: Math.round(dxfH * 10) / 10,
      areaCm2: Math.round(area * 10) / 10,
    });

    if (onVectorLoaded) {
      onVectorLoaded({
        widthMm: dxfW,
        heightMm: dxfH,
        areaCm2: area,
        dimensionsFormatted: `${dxfW.toFixed(1)} x ${dxfH.toFixed(1)} mm`,
      });
    }

    drawDxf();
  };

  const drawDxf = () => {
    const canvas = canvasRef.current;
    const dxf = dxfDataRef.current;
    if (!canvas || !dxf) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // Dark grid background
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    // Millimeter Grid lines
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.08)';
    ctx.lineWidth = 1;
    const step = 25;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const { scale, panX, panY } = transformRef.current;
    const toScreenX = (x: number) => x * scale + panX;
    const toScreenY = (y: number) => -y * scale + panY;

    // Laser Cutting Beam stroke
    ctx.strokeStyle = '#f97316';
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 6;
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    dxf.entities.forEach((ent: any) => {
      ctx.beginPath();
      if (ent.type === 'LINE') {
        const x1 = ent.vertices ? ent.vertices[0].x : ent.x1 ?? 0;
        const y1 = ent.vertices ? ent.vertices[0].y : ent.y1 ?? 0;
        const x2 = ent.vertices ? ent.vertices[1].x : ent.x2 ?? 0;
        const y2 = ent.vertices ? ent.vertices[1].y : ent.y2 ?? 0;
        ctx.moveTo(toScreenX(x1), toScreenY(y1));
        ctx.lineTo(toScreenX(x2), toScreenY(y2));
        ctx.stroke();
      } else if (ent.type === 'LWPOLYLINE' || ent.type === 'POLYLINE') {
        if (ent.vertices && ent.vertices.length > 1) {
          ctx.moveTo(toScreenX(ent.vertices[0].x), toScreenY(ent.vertices[0].y));
          for (let i = 1; i < ent.vertices.length; i++) {
            ctx.lineTo(toScreenX(ent.vertices[i].x), toScreenY(ent.vertices[i].y));
          }
          if (ent.shape || ent.closed) ctx.closePath();
          ctx.stroke();
        }
      } else if (ent.type === 'CIRCLE') {
        const cx = ent.center ? ent.center.x : ent.x1 || 0;
        const cy = ent.center ? ent.center.y : ent.y1 || 0;
        const r = ent.radius || 0;
        ctx.arc(toScreenX(cx), toScreenY(cy), r * scale, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (ent.type === 'ARC') {
        const cx = ent.center ? ent.center.x : ent.x1 || 0;
        const cy = ent.center ? ent.center.y : ent.y1 || 0;
        const r = ent.radius || 0;
        const start = ent.startAngle || 0;
        const end = ent.endAngle || Math.PI;
        ctx.arc(toScreenX(cx), toScreenY(cy), r * scale, -start, -end, true);
        ctx.stroke();
      }
    });

    ctx.restore();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || viewerFormat !== 'dxf') return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    transformRef.current.panX += dx;
    transformRef.current.panY += dy;
    drawDxf();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Attach non-passive wheel listener to canvas to allow preventDefault zoom without passive errors
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onWheelNative = (e: WheelEvent) => {
      if (viewerFormat !== 'dxf') return;
      e.preventDefault();
      const zoom = e.deltaY < 0 ? 1.15 : 0.85;
      transformRef.current.scale *= zoom;
      drawDxf();
    };

    canvas.addEventListener('wheel', onWheelNative, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', onWheelNative);
    };
  }, [viewerFormat]);

  const handleZoom = (factor: number) => {
    if (viewerFormat !== 'dxf') return;
    transformRef.current.scale *= factor;
    drawDxf();
  };

  return (
    <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          <span className="font-semibold text-slate-100">Visor Vectorial / CAD Láser</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 text-[11px] truncate max-w-[140px] sm:max-w-[200px]">
            {fileName}
          </span>
        </div>

        {/* Action Controls for DXF */}
        <div className="flex items-center gap-1.5">
          {viewerFormat === 'dxf' && (
            <>
              <button
                type="button"
                onClick={() => handleZoom(1.25)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700/80 transition flex items-center gap-1 text-xs font-medium"
                title="Acercar plano"
              >
                <Plus className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">Acercar</span>
              </button>
              <button
                type="button"
                onClick={() => handleZoom(0.8)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700/80 transition flex items-center gap-1 text-xs font-medium"
                title="Alejar plano"
              >
                <Minus className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">Alejar</span>
              </button>
              <button
                type="button"
                onClick={resetDxfView}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700/80 transition flex items-center gap-1 text-xs font-medium"
                title="Centrar y encuadrar"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Centrar</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Canvas / Content Container */}
      <div
        ref={containerRef}
        className="relative w-full h-80 sm:h-96 bg-slate-950 flex items-center justify-center overflow-hidden"
      >
        {viewerFormat === 'dxf' && (
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-grab active:cursor-grabbing block"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        )}

        {viewerFormat === 'svg' && (
          <div
            className="w-full h-full p-6 flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}

        {viewerFormat === 'pdf' && pdfBlobUrl && (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
            <iframe
              src={`${pdfBlobUrl}#toolbar=0&navpanes=0&view=Fit`}
              className="w-full h-full border-0"
              title="Plano Láser PDF"
            />
          </div>
        )}

        {viewerFormat === 'image' && imgBlobUrl && (
          <div className="w-full h-full p-6 flex items-center justify-center bg-slate-950">
            <img
              src={imgBlobUrl}
              alt="Grabado láser"
              className="max-h-[280px] max-w-[90%] object-contain rounded-xl border border-slate-700/80 shadow-2xl"
            />
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-20">
            <RefreshCw className="w-7 h-7 text-orange-400 animate-spin" />
            <span className="text-xs font-medium text-slate-300">
              Analizando plano vectorial y calculando perímetro...
            </span>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-20">
            <p className="text-red-400 font-semibold text-sm mb-2">{error}</p>
            <p className="text-slate-400 text-xs max-w-md">
              Verifica que el plano esté en formato DXF ASCII R12 o SVG estándar.
            </p>
          </div>
        )}
      </div>

      {/* Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-900/90 border-t border-slate-800 text-xs">
        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Dimensiones de Placa</span>
          <span className="font-bold text-orange-400 tabular-nums">
            {stats.widthMm > 0 ? `${stats.widthMm} x ${stats.heightMm} mm` : '-- x -- mm'}
          </span>
        </div>

        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Área de Superficie</span>
          <span className="font-bold text-slate-100 tabular-nums">
            {stats.areaCm2 > 0 ? `${stats.areaCm2} cm²` : '-- cm²'}
          </span>
        </div>

        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Espacio en Láser</span>
          <span className="font-bold text-slate-300 tabular-nums">
            {stats.widthMm > 0 ? `${(stats.widthMm / 10).toFixed(1)} x ${(stats.heightMm / 10).toFixed(1)} cm` : '--'}
          </span>
        </div>

        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Interacción</span>
            <span className="font-medium text-slate-300 text-[11px]">Arrastra: Desplazar | Rueda: Zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function parseSimpleDxf(text: string) {
  const lines = text.split(/\r?\n/);
  const entities: any[] = [];
  let current: any = null;

  for (let i = 0; i < lines.length - 1; i += 2) {
    const code = parseInt(lines[i].trim(), 10);
    const val = lines[i + 1].trim();

    if (code === 0) {
      if (current) entities.push(current);
      if (['LINE', 'CIRCLE', 'ARC', 'LWPOLYLINE'].includes(val)) {
        current = { type: val, vertices: [] };
      } else {
        current = null;
      }
    } else if (current) {
      if (code === 10) current.x1 = parseFloat(val);
      if (code === 20) current.y1 = parseFloat(val);
      if (code === 11) current.x2 = parseFloat(val);
      if (code === 21) current.y2 = parseFloat(val);
      if (code === 40) current.radius = parseFloat(val);
    }
  }
  if (current) entities.push(current);
  return { entities };
}

function getDxfBounds(dxf: any) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const expand = (x: number, y: number) => {
    if (isNaN(x) || isNaN(y)) return;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  };

  dxf.entities.forEach((ent: any) => {
    if (ent.type === 'LINE') {
      if (ent.vertices) {
        expand(ent.vertices[0].x, ent.vertices[0].y);
        expand(ent.vertices[1].x, ent.vertices[1].y);
      } else {
        expand(ent.x1, ent.y1);
        expand(ent.x2, ent.y2);
      }
    } else if (ent.type === 'LWPOLYLINE' || ent.type === 'POLYLINE') {
      if (ent.vertices) {
        ent.vertices.forEach((v: any) => expand(v.x, v.y));
      }
    } else if (ent.type === 'CIRCLE' || ent.type === 'ARC') {
      const cx = ent.center ? ent.center.x : ent.x1 || 0;
      const cy = ent.center ? ent.center.y : ent.y1 || 0;
      const r = ent.radius || 0;
      expand(cx - r, cy - r);
      expand(cx + r, cy + r);
    }
  });

  if (minX === Infinity) {
    minX = 0;
    minY = 0;
    maxX = 100;
    maxY = 100;
  }
  return { minX, minY, maxX, maxY };
}
