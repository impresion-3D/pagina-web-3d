/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MaterialOption3D {
  id: string;
  name: string;
  pricePerGram: number; // in MXN
  density: number; // g/cm³
  description: string;
  popular?: boolean;
}

export const MATERIALS_3D: MaterialOption3D[] = [
  {
    id: 'pla',
    name: 'PLA / PLA+ de Alta Precisión',
    pricePerGram: 1.2,
    density: 1.24,
    description: 'Económico, excelente detalle cosmético y dimensional. Ideal para maquetas y prototipos.',
    popular: true,
  },
  {
    id: 'petg',
    name: 'PETG Técnico (Resistencia Mecánica)',
    pricePerGram: 1.5,
    density: 1.27,
    description: 'Alta tenacidad, resistencia al impacto, humedad y rayos UV para uso funcional exterior.',
    popular: true,
  },
  {
    id: 'abs_asa',
    name: 'ABS / ASA Grado Industrial (95°C)',
    pricePerGram: 1.8,
    density: 1.05,
    description: 'Termo-resistente hasta 95°C y rayos UV. Ideal para piezas automotrices y gabinetes.',
  },
  {
    id: 'tpu',
    name: 'TPU Flexible (Goma 95A)',
    pricePerGram: 2.2,
    density: 1.21,
    description: 'Elastomérico elástico, excelente absorción de impactos, juntas y amortiguadores.',
  },
  {
    id: 'carbon_nylon',
    name: 'Nylon Fibra de Carbono (PA-CF)',
    pricePerGram: 3.8,
    density: 1.15,
    description: 'Rigidez extrema de grado aeroespacial y automotriz con alta resistencia térmica.',
  },
];

export interface InfillOption {
  id: string;
  label: string;
  factor: number; // multiplier for interior volume
}

export const INFILL_OPTIONS: InfillOption[] = [
  { id: '15', label: '15% - Decorativo / Visual (Ligero)', factor: 0.25 },
  { id: '30', label: '30% - Estándar Funcional (Recomendado)', factor: 0.40 },
  { id: '60', label: '60% - Reforzado para Esfuerzos', factor: 0.70 },
  { id: '100', label: '100% - Sólido Estructural', factor: 1.0 },
];

export interface QualityOption {
  id: string;
  label: string;
  timeMultiplier: number;
}

export const QUALITY_OPTIONS: QualityOption[] = [
  { id: '0.28', label: '0.28 mm - Borrador Rápido (Menor tiempo)', timeMultiplier: 0.75 },
  { id: '0.20', label: '0.20 mm - Calidad Estándar', timeMultiplier: 1.0 },
  { id: '0.12', label: '0.12 mm - Alta Definición / Fino', timeMultiplier: 1.45 },
];

export interface MaterialOptionLaser {
  id: string;
  name: string;
  costPerCm2: number; // in MXN per cm²
  description: string;
  popular?: boolean;
}

export const MATERIALS_LASER: MaterialOptionLaser[] = [
  {
    id: 'mdf_3mm',
    name: 'MDF 3 mm (Madera Prensada)',
    costPerCm2: 0.18,
    description: 'Económico, corte nítido y superficie lisa para maquetas, cajas y señalización.',
    popular: true,
  },
  {
    id: 'mdf_6mm',
    name: 'MDF 6 mm (Estructural)',
    costPerCm2: 0.28,
    description: 'Mayor rigidez para bases, celosías, repisas y ensambles reforzados.',
  },
  {
    id: 'acrylic_3mm_clear',
    name: 'Acrílico Cristal 3 mm (92% Transparencia)',
    costPerCm2: 0.55,
    description: 'Canto pulido óptico al fuego directo del láser. Displays y letreros luminosos.',
    popular: true,
  },
  {
    id: 'acrylic_3mm_color',
    name: 'Acrílico Color / Espejo 3 mm',
    costPerCm2: 0.68,
    description: 'Negro piano, blanco o acabados espejo dorado/plata de alto impacto visual.',
  },
  {
    id: 'plywood_wood',
    name: 'Triplay de Pino / Caobilla 4 mm',
    costPerCm2: 0.35,
    description: 'Veta natural de madera de primera clase, grabados cálidos y corte fino.',
  },
  {
    id: 'leather',
    name: 'Cuero Natural / Piel Sintética',
    costPerCm2: 0.60,
    description: 'Grabado profundo y marcado de accesorios, carteras y marroquinería.',
  },
  {
    id: 'metal_engraving',
    name: 'Grabado en Termo / Metal (Pieza del Cliente)',
    costPerCm2: 0.45,
    description: 'Personalización de alta resolución en botellas de acero, navajas o placas.',
  },
];

export type LaserMode = 'cut' | 'engrave' | 'both';

export interface Calculation3DInput {
  volumeCm3: number;
  materialId: string;
  infillPercent: string;
  qualityLayer: string;
  quantity: number;
}

export interface CalculationLaserInput {
  areaCm2: number;
  materialId: string;
  mode: LaserMode;
  quantity: number;
}

export interface QuoteBreakdown {
  unitBasePrice: number;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  totalPrice: number;
  estimatedDeliveryText: string;
  estimatedWeightGrams?: number;
  estimatedMachineHours?: number;
}

export function getVolumeDiscount(quantity: number): number {
  if (quantity >= 50) return 20; // 20% off
  if (quantity >= 20) return 15; // 15% off
  if (quantity >= 5) return 8;  // 8% off
  return 0;
}

export function calculateDeliveryTime(quantity: number, is3D: boolean): string {
  if (quantity <= 3) {
    return '24 a 48 horas (Producción Express)';
  } else if (quantity <= 15) {
    return '2 a 3 días hábiles (Lote Mediano)';
  } else if (quantity <= 50) {
    return '4 a 6 días hábiles (Lote Grande)';
  }
  return '7 a 10 días hábiles (Producción en Serie)';
}

export function calculate3DQuote(input: {
  volumeCm3: number;
  materialId: string;
  infillPercent: string;
  qualityLayer: string;
  quantity: number;
}): QuoteBreakdown {
  const mat = MATERIALS_3D.find((m) => m.id === input.materialId) || MATERIALS_3D[0];
  const infill = INFILL_OPTIONS.find((i) => i.id === input.infillPercent) || INFILL_OPTIONS[1];
  const quality = QUALITY_OPTIONS.find((q) => q.id === input.qualityLayer) || QUALITY_OPTIONS[1];

  const effectiveVolume = Math.max(input.volumeCm3 > 0 ? input.volumeCm3 : 35, 5);
  // Volume * density * effective infill factor = estimated grams of filament
  const estimatedWeightGrams = Math.max(effectiveVolume * mat.density * infill.factor, 8);
  const materialCost = estimatedWeightGrams * mat.pricePerGram;

  // Machine time estimate: roughly 15g/hour at normal quality
  const baseHours = (estimatedWeightGrams / 14) * quality.timeMultiplier;
  const machineRatePerHour = 18; // 18 MXN/hr machine wear & power
  const machineCost = baseHours * machineRatePerHour;

  const baseSetupFee = 35; // Bed leveling, slicer prep, cleaning
  const unitPrice = Math.max(Math.round((materialCost + machineCost + baseSetupFee) * 10) / 10, 65);

  const discountPercent = getVolumeDiscount(input.quantity);
  const subtotal = unitPrice * input.quantity;
  const discountAmount = Math.round((subtotal * (discountPercent / 100)) * 10) / 10;
  const totalPrice = Math.max(Math.round((subtotal - discountAmount) * 10) / 10, 65);

  return {
    unitBasePrice: unitPrice,
    subtotal: Math.round(subtotal * 10) / 10,
    discountPercent,
    discountAmount,
    totalPrice,
    estimatedDeliveryText: calculateDeliveryTime(input.quantity, true),
    estimatedWeightGrams: Math.round(estimatedWeightGrams * 10) / 10,
    estimatedMachineHours: Math.round(baseHours * 10) / 10,
  };
}

export function calculateLaserQuote(input: {
  areaCm2: number;
  materialId: string;
  mode: LaserMode;
  quantity: number;
}): QuoteBreakdown {
  const mat = MATERIALS_LASER.find((m) => m.id === input.materialId) || MATERIALS_LASER[0];
  const effectiveArea = Math.max(input.areaCm2 > 0 ? input.areaCm2 : 100, 20);

  // Mode factor
  let modeMultiplier = 1.0;
  if (input.mode === 'both') {
    modeMultiplier = 1.4;
  } else if (input.mode === 'engrave') {
    modeMultiplier = 1.2;
  }

  const materialCost = effectiveArea * mat.costPerCm2;
  const laserTimeCost = (effectiveArea * 0.12) * modeMultiplier; // laser head path travel
  const setupFee = 40; // alignment, laser focus, fume extraction

  const unitPrice = Math.max(Math.round((materialCost + laserTimeCost + setupFee) * modeMultiplier * 10) / 10, 70);
  const discountPercent = getVolumeDiscount(input.quantity);
  const subtotal = unitPrice * input.quantity;
  const discountAmount = Math.round((subtotal * (discountPercent / 100)) * 10) / 10;
  const totalPrice = Math.max(Math.round((subtotal - discountAmount) * 10) / 10, 70);

  return {
    unitBasePrice: unitPrice,
    subtotal: Math.round(subtotal * 10) / 10,
    discountPercent,
    discountAmount,
    totalPrice,
    estimatedDeliveryText: calculateDeliveryTime(input.quantity, false),
  };
}
