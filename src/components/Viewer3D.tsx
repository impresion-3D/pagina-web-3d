/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { RotateCw, Maximize2, Grid3X3, Plus, Minus, RefreshCw } from 'lucide-react';

interface Viewer3DProps {
  file: File | Blob | null;
  fileName?: string;
  onModelLoaded?: (stats: {
    dimensions: { x: number; y: number; z: number };
    volumeCm3: number;
    dimensionsFormatted: string;
  }) => void;
  accentColor?: string;
}

const MATERIAL_PRESETS = [
  { name: 'Cian Técnico', hex: 0x06b6d4, label: 'bg-cyan-500' },
  { name: 'Naranja Láser', hex: 0xf97316, label: 'bg-orange-500' },
  { name: 'Gris Carbón', hex: 0x475569, label: 'bg-slate-600' },
  { name: 'Blanco Puro', hex: 0xf8fafc, label: 'bg-white' },
  { name: 'Verde Neón', hex: 0x10b981, label: 'bg-emerald-500' },
];

export const Viewer3D: React.FC<Viewer3DProps> = ({
  file,
  fileName = 'modelo.stl',
  onModelLoaded,
  accentColor = '#06b6d4',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [selectedColor, setSelectedColor] = useState(MATERIAL_PRESETS[0]);
  const [stats, setStats] = useState<{
    widthMm: number;
    depthMm: number;
    heightMm: number;
    volumeCm3: number;
  }>({ widthMm: 0, depthMm: 0, heightMm: 0, volumeCm3: 0 });

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentMeshRef = useRef<THREE.Object3D | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);

  // Initialize scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 8000);
    camera.position.set(120, 110, 160);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 5000;
    controlsRef.current = controls;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 1.0);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(200, 300, 200);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 0.8);
    dirLight2.position.set(-200, 100, -200);
    scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0xf97316, 0.4);
    dirLight3.position.set(100, -100, -150);
    scene.add(dirLight3);

    const grid = new THREE.GridHelper(200, 20, 0x06b6d4, 0x1e293b);
    grid.position.y = 0;
    scene.add(grid);
    gridHelperRef.current = grid;

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotate;
        controlsRef.current.autoRotateSpeed = 2.0;
        controlsRef.current.update();
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update auto-rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Update wireframe / color when selected
  useEffect(() => {
    if (!currentMeshRef.current) return;
    currentMeshRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.wireframe = wireframe;
          mat.color.setHex(selectedColor.hex);
          mat.needsUpdate = true;
        }
      }
    });
  }, [wireframe, selectedColor]);

  // Load 3D file when prop changes
  useEffect(() => {
    if (!file || !sceneRef.current || !cameraRef.current || !controlsRef.current) return;

    setLoading(true);
    setError(null);

    const ext = fileName.toLowerCase().split('.').pop() || 'stl';
    const reader = new FileReader();

    const handleObject3D = (object: THREE.Object3D, optionalGeo?: THREE.BufferGeometry) => {
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      if (!scene || !camera || !controls) return;

      if (currentMeshRef.current) {
        scene.remove(currentMeshRef.current);
      }

      object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry.computeVertexNormals();
          mesh.material = new THREE.MeshStandardMaterial({
            color: selectedColor.hex,
            roughness: 0.35,
            metalness: 0.25,
            wireframe: wireframe,
            side: THREE.DoubleSide,
          });
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });

      const box = new THREE.Box3().setFromObject(object);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);

      // Center geometry at ground level
      object.position.x -= center.x;
      object.position.y -= center.y;
      object.position.z -= center.z;
      object.position.y += size.y / 2;

      scene.add(object);
      currentMeshRef.current = object;

      // Adjust camera distance
      const maxDim = Math.max(size.x, size.y, size.z, 20);
      const cameraDist = maxDim * 2.2;
      camera.near = Math.max(0.1, maxDim / 100);
      camera.far = Math.max(1000, cameraDist * 10);
      camera.position.set(cameraDist * 0.9, cameraDist * 0.8, cameraDist);
      camera.lookAt(0, size.y / 2, 0);
      camera.updateProjectionMatrix();

      controls.target.set(0, size.y / 2, 0);
      controls.update();

      // Dynamic grid
      if (gridHelperRef.current) scene.remove(gridHelperRef.current);
      const gridSize = Math.max(120, Math.ceil((maxDim * 2) / 40) * 40);
      const grid = new THREE.GridHelper(gridSize, 20, 0x06b6d4, 0x1e293b);
      grid.position.y = 0;
      scene.add(grid);
      gridHelperRef.current = grid;

      // Calculate volume
      let calculatedVolume = 0;
      if (optionalGeo) {
        calculatedVolume = calculateMeshVolume(optionalGeo);
      } else {
        // Fallback approximation for complex OBJ assemblies
        calculatedVolume = (size.x * size.y * size.z * 0.42) / 1000;
      }

      const formatted = `${size.x.toFixed(1)} x ${size.z.toFixed(1)} x ${size.y.toFixed(1)} mm`;
      setStats({
        widthMm: Math.round(size.x * 10) / 10,
        depthMm: Math.round(size.z * 10) / 10,
        heightMm: Math.round(size.y * 10) / 10,
        volumeCm3: Math.round(calculatedVolume * 100) / 100,
      });

      if (onModelLoaded) {
        onModelLoaded({
          dimensions: { x: size.x, y: size.y, z: size.z },
          volumeCm3: calculatedVolume,
          dimensionsFormatted: formatted,
        });
      }
      setLoading(false);
    };

    if (ext === 'obj') {
      reader.readAsText(file);
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const loader = new OBJLoader();
          const obj = loader.parse(text);
          handleObject3D(obj);
        } catch (err) {
          setError('No se pudo procesar el archivo OBJ.');
          setLoading(false);
        }
      };
    } else {
      // STL Loader
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const loader = new STLLoader();
          const geometry = loader.parse(buffer);
          const material = new THREE.MeshStandardMaterial({
            color: selectedColor.hex,
            roughness: 0.35,
            metalness: 0.25,
            wireframe: wireframe,
            side: THREE.DoubleSide,
          });
          const mesh = new THREE.Mesh(geometry, material);
          handleObject3D(mesh, geometry);
        } catch (err) {
          setError('No se pudo procesar el archivo STL. Verifica que sea un archivo STL válido.');
          setLoading(false);
        }
      };
    }

    reader.onerror = () => {
      setError('Error al leer el archivo desde el dispositivo.');
      setLoading(false);
    };
  }, [file, fileName]);

  const handleZoom = (factor: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const offset = cameraRef.current.position.clone().sub(controlsRef.current.target);
    if (factor < 1 && offset.length() > 5) {
      offset.multiplyScalar(factor);
      cameraRef.current.position.copy(controlsRef.current.target).add(offset);
      controlsRef.current.update();
    } else if (factor > 1 && offset.length() < 10000) {
      offset.multiplyScalar(factor);
      cameraRef.current.position.copy(controlsRef.current.target).add(offset);
      controlsRef.current.update();
    }
  };

  const handleResetCamera = () => {
    if (!currentMeshRef.current || !cameraRef.current || !controlsRef.current) return;
    const box = new THREE.Box3().setFromObject(currentMeshRef.current);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z, 20);
    const cameraDist = maxDim * 2.2;
    cameraRef.current.position.set(cameraDist * 0.9, cameraDist * 0.8, cameraDist);
    controlsRef.current.target.set(0, size.y / 2, 0);
    controlsRef.current.update();
  };

  return (
    <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-semibold text-slate-100">Visor 3D Interactivo FDM</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 text-[11px] truncate max-w-[140px] sm:max-w-[200px]">
            {fileName}
          </span>
        </div>

        {/* Color Palette Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 mr-1 hidden md:inline">Color:</span>
          {MATERIAL_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setSelectedColor(p)}
              className={`w-4 h-4 rounded-full ${p.label} border transition-transform ${
                selectedColor.name === p.name ? 'scale-125 border-white shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              title={p.name}
              aria-label={`Cambiar color a ${p.name}`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1.5 ${
              autoRotate
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80'
            }`}
            title="Giro continuo automático"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Giro</span>
          </button>

          <button
            type="button"
            onClick={() => setWireframe(!wireframe)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1.5 ${
              wireframe
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80'
            }`}
            title="Ver estructura de polígonos"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Malla</span>
          </button>

          <button
            type="button"
            onClick={handleResetCamera}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700/80 transition flex items-center gap-1.5 text-xs font-medium"
            title="Centrar perspectiva"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Centrar</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas */}
      <div className="relative w-full h-80 sm:h-96 bg-slate-950">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing outline-none" />

        {/* Floating Zoom Buttons */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={() => handleZoom(0.8)}
            className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border border-slate-700 flex items-center justify-center transition shadow-lg active:scale-95"
            title="Acercar (+)"
            aria-label="Acercar modelo 3D"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(1.25)}
            className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border border-slate-700 flex items-center justify-center transition shadow-lg active:scale-95"
            title="Alejar (-)"
            aria-label="Alejar modelo 3D"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-20">
            <RefreshCw className="w-7 h-7 text-cyan-400 animate-spin" />
            <span className="text-xs font-medium text-slate-300">
              Procesando geometría 3D y calculando volumen...
            </span>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-20">
            <p className="text-red-400 font-semibold text-sm mb-2">{error}</p>
            <p className="text-slate-400 text-xs max-w-md">
              Asegúrate de que el archivo no esté corrupto o intenta subir un formato STL binario/ASCII o OBJ estándar.
            </p>
          </div>
        )}
      </div>

      {/* Dimensional Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-900/90 border-t border-slate-800 text-xs">
        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Dimensiones (X · Y · Z)</span>
          <span className="font-bold text-cyan-400 tabular-nums">
            {stats.widthMm > 0
              ? `${stats.widthMm} x ${stats.depthMm} x ${stats.heightMm} mm`
              : '-- x -- x -- mm'}
          </span>
        </div>

        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Volumen Calculado</span>
          <span className="font-bold text-slate-100 tabular-nums">
            {stats.volumeCm3 > 0 ? `${stats.volumeCm3} cm³` : '-- cm³'}
          </span>
        </div>

        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Área de Cama Ocupada</span>
          <span className="font-bold text-slate-300 tabular-nums">
            {stats.widthMm > 0 ? `${Math.round((stats.widthMm * stats.depthMm) / 100)} cm²` : '-- cm²'}
          </span>
        </div>

        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Navegación</span>
            <span className="font-medium text-slate-300 text-[11px]">Rotar: Clic | Zoom: Rueda</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Calculates accurate volume of a BufferGeometry by summing signed tetrahedrons
 */
function calculateMeshVolume(geometry: THREE.BufferGeometry): number {
  const pos = geometry.attributes.position;
  if (!pos) return 0;
  let totalVolume = 0;

  if (geometry.index) {
    const idx = geometry.index.array;
    for (let i = 0; i < idx.length; i += 3) {
      const i1 = idx[i];
      const i2 = idx[i + 1];
      const i3 = idx[i + 2];
      totalVolume += signedVolumeOfTriangle(
        pos.getX(i1), pos.getY(i1), pos.getZ(i1),
        pos.getX(i2), pos.getY(i2), pos.getZ(i2),
        pos.getX(i3), pos.getY(i3), pos.getZ(i3)
      );
    }
  } else {
    for (let i = 0; i < pos.count; i += 3) {
      totalVolume += signedVolumeOfTriangle(
        pos.getX(i), pos.getY(i), pos.getZ(i),
        pos.getX(i + 1), pos.getY(i + 1), pos.getZ(i + 1),
        pos.getX(i + 2), pos.getY(i + 2), pos.getZ(i + 2)
      );
    }
  }

  // Convert cubic mm to cubic cm
  return Math.abs(totalVolume) / 1000;
}

function signedVolumeOfTriangle(
  p1x: number, p1y: number, p1z: number,
  p2x: number, p2y: number, p2z: number,
  p3x: number, p3y: number, p3z: number
): number {
  return (
    (1.0 / 6.0) *
    (-p3x * p2y * p1z +
      p2x * p3y * p1z +
      p3x * p1y * p2z -
      p1x * p3y * p2z -
      p2x * p1y * p3z +
      p1x * p2y * p3z)
  );
}
