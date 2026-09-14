import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleAlpha, sampleTriangles } from '../hit-test.mjs';

const mask = { width: 2, height: 2, alpha: new Uint8Array([0, 255, 0, 255]) };
const vertex = (x, y, u, v, a = 1) => [x, y, 1, 1, 1, a, u, v, 0, 0, 0, 1];
const vertices = [...vertex(0, 0, 0, 0), ...vertex(10, 0, 1, 0), ...vertex(10, 10, 1, 1), ...vertex(0, 10, 0, 1)];
const triangles = [0, 1, 2, 2, 3, 0];

test('texture holes, linear filtering, transformed triangles and slot alpha determine input', () => {
  assert.equal(sampleAlpha(mask, 0.5, 0.5), 0.5);
  assert.equal(sampleTriangles(mask, vertices, triangles, 1, 5), 0);
  assert.equal(sampleTriangles(mask, vertices, triangles, 9, 5), 1);
  assert.equal(sampleTriangles(mask, vertices, triangles, 12, 5), 0);
  const faded = vertices.map((value, i) => i % 12 === 5 ? 0.5 : value);
  assert.equal(sampleTriangles(mask, faded, triangles, 9, 5), 0.5);
  assert.equal(sampleTriangles(mask, faded, triangles, 9, 5, 0.5), 0.75);
  const clipped = [0, 1, 2];
  assert.equal(sampleTriangles(mask, vertices, clipped, 9, 9.5), 0);
});

test('shared mesh edge is sampled once and rotated atlas UVs retain transparent holes', () => {
  const half = { width: 1, height: 1, alpha: new Uint8Array([128]) };
  assert.equal(sampleTriangles(half, vertices, triangles, 5, 5), 128 / 255);
  const twice = sampleTriangles(half, [...vertices, ...vertices], [...triangles, ...triangles.map(i => i + 4)], 5, 5);
  assert.ok(Math.abs(twice - (128 / 255 + 128 / 255 * (1 - 128 / 255))) < 1e-10,
    'overlapping mesh faces still composite twice');
  const rotated = [...vertex(0, 0, 0, 1), ...vertex(10, 0, 0, 0), ...vertex(10, 10, 1, 0), ...vertex(0, 10, 1, 1)];
  assert.equal(sampleTriangles(mask, rotated, triangles, 5, 1), 0);
  assert.equal(sampleTriangles(mask, rotated, triangles, 5, 9), 1);
});

