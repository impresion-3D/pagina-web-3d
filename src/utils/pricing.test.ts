/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculate3DQuote,
  calculateLaserQuote,
  getVolumeDiscount,
  calculateDeliveryTime,
  MATERIALS_3D,
  MATERIALS_LASER,
} from './pricing.js';

test('getVolumeDiscount returns expected tiers', () => {
  assert.equal(getVolumeDiscount(1), 0);
  assert.equal(getVolumeDiscount(4), 0);
  assert.equal(getVolumeDiscount(5), 8);
  assert.equal(getVolumeDiscount(19), 8);
  assert.equal(getVolumeDiscount(20), 15);
  assert.equal(getVolumeDiscount(49), 15);
  assert.equal(getVolumeDiscount(50), 20);
});

test('calculateDeliveryTime provides realistic deadlines', () => {
  assert.match(calculateDeliveryTime(1, true), /24 a 48 horas/);
  assert.match(calculateDeliveryTime(10, true), /2 a 3 días hábiles/);
  assert.match(calculateDeliveryTime(30, true), /4 a 6 días hábiles/);
  assert.match(calculateDeliveryTime(100, true), /7 a 10 días hábiles/);
});

test('calculate3DQuote calculates reasonable costs and applies discount', () => {
  const quoteSingle = calculate3DQuote({
    volumeCm3: 50,
    materialId: 'pla',
    infillPercent: '30',
    qualityLayer: '0.20',
    quantity: 1,
  });

  assert.ok(quoteSingle.totalPrice > 65, 'Base price must cover minimum setup');
  assert.equal(quoteSingle.discountPercent, 0);
  assert.ok(quoteSingle.estimatedWeightGrams! > 0);
  assert.ok(quoteSingle.estimatedMachineHours! > 0);

  const quoteBatch = calculate3DQuote({
    volumeCm3: 50,
    materialId: 'pla',
    infillPercent: '30',
    qualityLayer: '0.20',
    quantity: 25,
  });

  assert.equal(quoteBatch.discountPercent, 15);
  assert.ok(quoteBatch.discountAmount > 0);
  assert.equal(
    quoteBatch.totalPrice,
    Math.round((quoteBatch.subtotal - quoteBatch.discountAmount) * 10) / 10
  );
});

test('calculateLaserQuote handles cut, engrave and both modes', () => {
  const cutQuote = calculateLaserQuote({
    areaCm2: 200,
    materialId: 'mdf_3mm',
    mode: 'cut',
    quantity: 1,
  });

  const bothQuote = calculateLaserQuote({
    areaCm2: 200,
    materialId: 'mdf_3mm',
    mode: 'both',
    quantity: 1,
  });

  assert.ok(
    bothQuote.totalPrice > cutQuote.totalPrice,
    'Combined cut and engrave must account for extra laser passes'
  );
  assert.ok(MATERIALS_LASER.length >= 5);
  assert.ok(MATERIALS_3D.length >= 5);
});
