import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import {
  Compass,
  Eye,
  Sparkles,
  Layers,
  Mountain,
  Building2,
  Sun,
  Sunset,
  Moon,
  Sliders,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Info,
  CheckCircle2,
  Upload,
  Box,
  ArrowUpRight,
  Columns,
  Tag,
  Grid,
  Circle,
  X
} from 'lucide-react';

// ============================================================================
// 1. DATOS CURADOS Y CONCISOS (SIN EL PUNTO 5)
// ============================================================================

const PROJECT_INFO = {
  title: 'CAOS FUNCIONAL',
  subtitle: '“Un campus que funciona, pero que parece olvidar dónde está.”',
  tagline: 'Dos estudiantes. Una universidad. Otra forma de verla.',
  authors: 'Estudiantes de Ingeniería de Sistemas — UCV Huaraz, El Pinar',
  coordinates: '9°30′42″S 77°31′18″O • 3,100 m s.n.m. • Huaraz, Perú',
  mode1Quote:
    '“Vemos una universidad moderna y grande, pero sentimos que hay demasiados elementos que no terminan de conectarse entre sí.”',
  mode2Quote:
    '“No queremos cambiar toda la universidad, solamente imaginamos cómo podría aprovechar mejor el lugar donde está.”',
  comparisonFinalQuote:
    '“EL CAOS NO SIEMPRE SIGNIFICA QUE ALGO NO FUNCIONE. A VECES SIGNIFICA QUE TODAVÍA PUEDE SER MEJOR.”',
  comparisonFinalSub:
    'Nuestra percepción, nuestra crítica y nuestra propuesta para el campus UCV Huaraz.',
  closingQuote:
    '“NO QUEREMOS OTRA UNIVERSIDAD. QUEREMOS VER DE OTRA FORMA LA QUE YA TENEMOS.”',
  closingSub: 'Caos Funcional — Nuestra percepción del campus UCV Huaraz.'
};

// Puntos interactivos 3D (sintetizados para lectura rápida e impacto visual)
const ANALYSIS_MARKERS = [
  // LO BUENO — Azul
  {
    id: 'bueno-1',
    category: 'bueno',
    categoryLabel: 'LO BUENO',
    title: 'Estructura grande y llamativa',
    shortDesc: 'El campus tiene una estructura grande y llamativa.',
    fullDesc:
      'El pabellón principal de 6 niveles (Bloques A y B) impone una presencia sólida apenas llegas a El Pinar y organiza la actividad académica.',
    proposalChange:
      'Conservamos intacta su escala y estructura, limpiando únicamente la saturación de colores en sus paños exteriores.',
    position: [5.5, 7.8, 2.5],
    cameraTarget: [5.5, 4.5, 0],
    cameraPos: [8, 9, 22],
    zone: 'Pabellón Principal A-B'
  },
  {
    id: 'bueno-2',
    category: 'bueno',
    categoryLabel: 'LO BUENO',
    title: 'Diseño moderno que destaca',
    shortDesc: 'Su diseño moderno hace que destaque en la zona.',
    fullDesc:
      'Sus líneas contemporáneas crean un hito urbano reconocible dentro del valle de Huaraz.',
    proposalChange:
      'Acompañamos esa modernidad con madera y piedra andina para que dialogue con su entorno.',
    position: [15.2, 6.4, 2.5],
    cameraTarget: [11, 4.5, 0],
    cameraPos: [22, 8, 17],
    zone: 'Extremo Este — Bloque A'
  },
  {
    id: 'bueno-3',
    category: 'bueno',
    categoryLabel: 'LO BUENO',
    title: 'Ventanales abiertos y actuales',
    shortDesc: 'Los ventanales aportan una imagen abierta y actual.',
    fullDesc:
      'La amplia superficie vidriada aprovecha el sol de Huaraz e ilumina naturalmente aulas y laboratorios.',
    proposalChange:
      'Integramos sensores lumínicos automatizados y celosías cálidas para evitar deslumbramiento.',
    position: [10.0, 5.2, 2.6],
    cameraTarget: [9, 4.5, 0],
    cameraPos: [11, 6, 14],
    zone: 'Fachada Acristalada'
  },
  {
    id: 'bueno-4',
    category: 'bueno',
    categoryLabel: 'LO BUENO',
    title: 'Espacios funcionales',
    shortDesc: 'Cuenta con espacios que cumplen funciones universitarias.',
    fullDesc:
      'Reconocemos que la universidad funciona bien en su interior: laboratorios de cómputo, aulas y circulaciones cumplen su objetivo diario.',
    proposalChange:
      'Potenciamos su uso con un sistema en tiempo real de disponibilidad de aulas y laboratorios.',
    position: [1.2, 4.8, 2.6],
    cameraTarget: [2, 4, 0],
    cameraPos: [-3, 7, 15],
    zone: 'Bloque B — Aulas y Labs'
  },

  // LO MALO — Naranja
  {
    id: 'malo-1',
    category: 'malo',
    categoryLabel: 'LO MALO',
    title: 'Exceso de elementos en fachada',
    shortDesc: 'Sentimos que existen demasiados elementos visuales en la fachada.',
    fullDesc:
      'Volúmenes blancos escalonados, ventanitas cuadradas, balcones remetidos, columnas azul oscuro y franjas rojas ocurren al mismo tiempo sin descanso visual.',
    proposalChange:
      'Unificamos los antepechos bajo una línea continua con textura cálida de madera.',
    position: [3.2, 6.2, 2.6],
    cameraTarget: [4, 5, 0],
    cameraPos: [3, 6.5, 13],
    zone: 'Fachada Bloque B'
  },
  {
    id: 'malo-2',
    category: 'malo',
    categoryLabel: 'LO MALO',
    title: 'Colores y formas que compiten',
    shortDesc: 'Las formas y colores parecen competir entre sí.',
    fullDesc:
      'El azul intenso, los muros perimétricos pintados, las carpas y los acentos rojos en los extremos A y B compiten con la serenidad de las montañas.',
    proposalChange:
      'Simplificamos la paleta exterior conservando el azul institucional y tonos naturales.',
    position: [13.5, 4.5, 1.5],
    cameraTarget: [11, 4, 0],
    cameraPos: [18, 6.5, 12],
    zone: 'Flanco Lateral — Bloque A'
  },
  {
    id: 'malo-3',
    category: 'malo',
    categoryLabel: 'LO MALO',
    title: 'Friso y anuncio "CAMPUS HUARAZ"',
    shortDesc: 'Los grandes anuncios pueden quitarle protagonismo al edificio.',
    fullDesc:
      'El letrero superior en el edificio secundario y los elementos publicitarios en el patio sobrecargan la lectura limpia de la arquitectura.',
    proposalChange:
      'Limpiamos la coronación del edificio secundario y habilitamos una terraza-mirador verde hacia los nevados.',
    position: [-9.2, 5.8, 0.8],
    cameraTarget: [-9.0, 4.2, -0.5],
    cameraPos: [-12, 7.5, 12],
    zone: 'Coronación Edificio Secundario'
  },
  {
    id: 'malo-4',
    category: 'malo',
    categoryLabel: 'LO MALO',
    title: 'Patio saturado de estructuras',
    shortDesc: 'El espacio exterior podría aprovecharse mucho mejor.',
    fullDesc:
      'Entre cercos azules, carpas provisionales, rampas cerradas y tierra compactada, el patio frontal pierde amplitud y calidez.',
    proposalChange:
      'Rediseñamos la explanada como un parque universitario abierto con jardines nativos y senderos de piedra.',
    position: [-5.5, 1.4, 5.8],
    cameraTarget: [-3, 1.2, 4],
    cameraPos: [-9, 6.5, 14],
    zone: 'Explanada y Carpa Frontal'
  },

  // LO QUE PROPONEMOS — Verde
  {
    id: 'prop-1',
    category: 'propuesta',
    categoryLabel: 'LO QUE PROPONEMOS',
    title: 'Organización visual de fachada',
    shortDesc: 'Mejorar la organización visual de la fachada.',
    fullDesc:
      'Reordenamos el ritmo horizontal del edificio principal con celosías continuas que equilibran los volúmenes blancos escalonados sin perder la esencia UCV.',
    proposalChange: 'Celosías lineales cálidas y depuración de franjas estridentes.',
    position: [6.8, 4.2, 2.7],
    cameraTarget: [5, 4, 0],
    cameraPos: [7.8, 6.0, 13],
    zone: 'Fachada Reordenada'
  },
  {
    id: 'prop-2',
    category: 'propuesta',
    categoryLabel: 'LO QUE PROPONEMOS',
    title: 'Áreas verdes y descanso',
    shortDesc: 'Crear áreas verdes y espacios de descanso.',
    fullDesc:
      'Sustituimos las carpas cerradas y cercos duros por islas ecológicas con árboles nativos y pérgolas abiertas de madera para convivir.',
    proposalChange: 'Nuevos jardines andinos y mobiliario de descanso en la plaza central.',
    position: [-1.5, 1.2, 5.5],
    cameraTarget: [0, 1.2, 4],
    cameraPos: [-2, 6.0, 14],
    zone: 'Plaza Parque Central'
  },
  {
    id: 'prop-3',
    category: 'propuesta',
    categoryLabel: 'LO QUE PROPONEMOS',
    title: 'Mirador a la Cordillera Blanca',
    shortDesc: 'Dar más importancia a las montañas y sus vistas.',
    fullDesc:
      'Transformamos la cubierta del bloque secundario en una terraza-mirador con pérgola de madera orientada hacia los nevados de Huaraz.',
    proposalChange: 'Mirador universitario en azotea con visuales abiertas al horizonte.',
    position: [-9.2, 5.9, -0.5],
    cameraTarget: [-9.0, 4.2, -0.5],
    cameraPos: [-6, 8.5, 13],
    zone: 'Mirador Estudiantil'
  },
  {
    id: 'prop-4',
    category: 'propuesta',
    categoryLabel: 'LO QUE PROPONEMOS',
    title: 'Piedra y vegetación local',
    shortDesc: 'Incorporar piedra, vegetación local y materiales relacionados con la zona.',
    fullDesc:
      'Revestimos los muretes, rampas y zócalos con piedra granítica de Huaraz para integrar el campus con el paisaje de El Pinar.',
    proposalChange: 'Zócalos, rampas y muros bajos en piedra andina natural.',
    position: [2.2, 1.1, 6.2],
    cameraTarget: [2, 1.2, 4],
    cameraPos: [4, 5.5, 14],
    zone: 'Borde Paisajístico'
  }
];

const BALANCE_DATA = {
  rescatamos: [
    {
      id: 'r1',
      title: 'Modernidad',
      desc: 'Una infraestructura contemporánea con amplios ventanales y volúmenes dinámicos que proyecta una imagen universitaria actual.'
    },
    {
      id: 'r2',
      title: 'Presencia',
      desc: 'Su volumen destaca inmediatamente al llegar a El Pinar, generando un punto de referencia claro.'
    },
    {
      id: 'r3',
      title: 'Tamaño',
      desc: 'Los 6 niveles del pabellón principal y los 4 del secundario albergan cómodamente múltiples escuelas profesionales.'
    },
    {
      id: 'r4',
      title: 'Identidad visual',
      desc: 'El uso de los colores institucionales y el núcleo central azul hacen que el campus sea reconocible a distancia.'
    }
  ],
  cambiariamos: [
    {
      id: 'c1',
      title: 'Orden visual',
      desc: 'Reducir la saturación de muretes azules, franjas rojas, carpas y letreros que compiten al mismo tiempo.'
    },
    {
      id: 'c2',
      title: 'Conexión con el paisaje',
      desc: 'Abrir visuales y terrazas hacia la Cordillera Blanca para recordar que estamos en Huaraz.'
    },
    {
      id: 'c3',
      title: 'Espacios exteriores',
      desc: 'Reemplazar los cerramientos provisionales y el suelo duro por una plaza peatonal arbolada e integrada.'
    },
    {
      id: 'c4',
      title: 'Zonas de descanso',
      desc: 'Crear áreas cálidas con sombra natural, madera y piedra local para convivir entre horas de clase.'
    }
  ]
};

// ============================================================================
// 2. TEXTURAS PROCEDURALES DE ALTA DENSIDAD (ESTILO FOTOGRAMETRÍA REALISTA)
// ============================================================================

function createPhotogrammetryGroundTexture(isProposal = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Base de tierra compactada / pavimento con variaciones orgánicas de escaneo 3D
  ctx.fillStyle = isProposal ? '#4b5563' : '#9ca3af';
  ctx.fillRect(0, 0, 1024, 1024);

  // Textura terrosa y césped del patio frontal (como en la imagen de fotogrametría)
  const patioGrad = ctx.createRadialGradient(420, 680, 40, 450, 680, 420);
  if (isProposal) {
    patioGrad.addColorStop(0, '#166534');
    patioGrad.addColorStop(0.6, '#15803d');
    patioGrad.addColorStop(1, '#475569');
  } else {
    patioGrad.addColorStop(0, '#8c886f');
    patioGrad.addColorStop(0.55, '#78755e');
    patioGrad.addColorStop(0.85, '#9ca38f');
    patioGrad.addColorStop(1, '#cbd5e1');
  }
  ctx.fillStyle = patioGrad;
  ctx.fillRect(80, 420, 780, 560);

  // Grano fotogramétrico realista (micro-variación de suelo, grava y sombras)
  for (let i = 0; i < 9000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = 1 + Math.random() * 3.5;
    const alpha = 0.04 + Math.random() * 0.08;
    ctx.fillStyle =
      i % 2 === 0
        ? `rgba(30, 35, 28, ${alpha})`
        : `rgba(235, 232, 215, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Veredas perimetrales y pasillos frente al edificio principal
  ctx.fillStyle = '#d1d5db';
  ctx.fillRect(140, 340, 780, 95);
  ctx.strokeStyle = '#6b7280';
  ctx.lineWidth = 3;
  for (let x = 140; x < 920; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, 340);
    ctx.lineTo(x, 435);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

function createCorrugatedWhiteRoofTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Blanco ligeramente cálido/grisáceo con oclusión ambiental de escaneo aéreo
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#e2e8f0');
  grad.addColorStop(0.5, '#f8fafc');
  grad.addColorStop(1, '#dde3ea');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Líneas de calamina / aluzinc y juntas estructurales del techo
  for (let x = 0; x < 1024; x += 6) {
    ctx.fillStyle = x % 12 === 0 ? 'rgba(148,163,184,0.28)' : 'rgba(255,255,255,0.4)';
    ctx.fillRect(x, 0, 3, 512);
  }

  // Juntas transversales y pátina realista de techo escaneado
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.35)';
  ctx.lineWidth = 4;
  [128, 256, 384].forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  });
  for (let x = 120; x < 1024; x += 140) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 15, 512);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

function createSideWallBlueTexture(isProposal = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Fondo azul profundo institucional como en el flanco derecho de la foto 3D
  ctx.fillStyle = '#0e2a66';
  ctx.fillRect(0, 0, 512, 1024);

  // Sombreado sutil de paneles y oclusión ambiental
  for (let y = 0; y < 1024; y += 48) {
    ctx.strokeStyle = 'rgba(7, 18, 46, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Columna central remetida con ventanas de pisos y antepechos blancos
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(185, 80, 142, 860);
  for (let f = 0; f < 6; f++) {
    const wy = 110 + f * 138;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(198, wy, 116, 78);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.strokeRect(198, wy, 116, 78);
  }

  // En el modo actual, incluir las barras verticales rojas y blancas exactas de la imagen
  if (!isProposal) {
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(42, 460, 22, 195);
    ctx.fillRect(74, 460, 22, 195);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(42, 680, 14, 210);
    ctx.fillRect(68, 680, 14, 210);
    ctx.fillRect(94, 680, 14, 210);

    // Acentos rojos/blancos en el paño derecho del flanco
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(365, 290, 88, 22);
    ctx.fillRect(365, 340, 88, 22);
    ctx.fillRect(365, 580, 70, 20);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

function createSteppedWhitePierTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Estuco blanco arquitectónico con ligera textura de fotogrametría
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, 256, 1024);

  // Ventanitas cuadradas perforadas escalonadas (rasgo clave de la imagen de referencia)
  for (let f = 0; f < 6; f++) {
    const baseY = 75 + f * 152;
    // Dos ventanitas cuadradas por nivel en disposición escalonada
    const positions = f % 2 === 0 ? [[38, baseY], [142, baseY + 42]] : [[142, baseY], [38, baseY + 42]];
    positions.forEach(([wx, wy]) => {
      // Sombra profunda del vano
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(wx, wy, 64, 58);
      // Marco interior de aluminio y reflejo verdoso
      ctx.fillStyle = '#1e3a4c';
      ctx.fillRect(wx + 6, wy + 6, 52, 46);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 4;
      ctx.strokeRect(wx, wy, 64, 58);
    });
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

function createRecessedBalconyBayTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Fondo de cristal verdoso/azulado oscuro como en los salones reales
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#0f293a');
  grad.addColorStop(0.5, '#164e63');
  grad.addColorStop(1, '#091926');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Reflejos internos de cielo e iluminación de aulas
  ctx.fillStyle = 'rgba(186, 230, 253, 0.18)';
  ctx.fillRect(28, 40, 190, 180);
  ctx.fillRect(280, 40, 190, 180);

  // Carpintería metálica blanca/gris de las mamparas
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 502, 502);
  for (let x = 128; x < 512; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

function createSecondaryBuildingFacadeTexture(isProposal = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, 1024, 512);

  // Friso superior con letras azules/rojas "CAMPUS HUARAZ" como en la foto 3D
  if (!isProposal) {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 8, 1024, 62);
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(0, 56, 1024, 14);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(720, 18, 55, 36);
    ctx.fillStyle = '#0f296b';
    ctx.font = '900 42px Inter, Arial, sans-serif';
    ctx.fillText('CAMPUS HUARAZ', 120, 48);
  } else {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 12, 1024, 48);
  }

  // 3 pisos superiores de ventanas corridas verdosas/azuladas con carpintería
  for (let f = 0; f < 3; f++) {
    const y = 88 + f * 108;
    ctx.fillStyle = '#13384c';
    ctx.fillRect(45, y, 760, 66);
    // Divisiones verticales de ventanas
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 5;
    for (let wx = 45; wx <= 805; wx += 48) {
      ctx.beginPath();
      ctx.moveTo(wx, y);
      ctx.lineTo(wx, y + 66);
      ctx.stroke();
    }
    // Antepecho blanco con línea azul inferior
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(45, y + 66, 760, 38);
  }

  // Primer piso oscuro con pórtico azul marino
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(45, 412, 760, 100);
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(45, 402, 760, 18);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  return tex;
}

// ============================================================================
// 3. ILUSTRACIÓN VECTORIAL FIEL AL DRON (PARA SECCIONES 2D COMPARATIVAS)
// ============================================================================

const CampusDroneVisual = ({
  mode = 'actual',
  mountainReveal = 1,
  className = ''
}) => {
  const isProposal = mode === 'propuesta';

  return (
    <svg
      viewBox="0 0 1200 675"
      className={`w-full h-full object-cover select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
        <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="hillGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6b5b45" />
          <stop offset="55%" stopColor="#847154" />
          <stop offset="100%" stopColor="#3f5434" />
        </linearGradient>
      </defs>

      <rect width="1200" height="675" fill="url(#skyGrad)" />

      {/* CORDILLERA BLANCA Y MONTAÑAS DE EL PINAR */}
      <g
        style={{
          opacity: mountainReveal,
          transform: `translateY(${(1 - mountainReveal) * 50}px)`,
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <ellipse cx="220" cy="54" rx="110" ry="20" fill="#ffffff" fillOpacity="0.8" />
        <ellipse cx="490" cy="42" rx="85" ry="16" fill="#ffffff" fillOpacity="0.7" />
        <polygon
          points="0,210 75,92 140,122 215,44 285,108 350,74 430,170 495,88 570,175 680,190 0,240"
          fill="url(#snowGrad)"
        />
        <polygon points="215,44 248,115 285,108" fill="#94a3b8" fillOpacity="0.65" />
        <polygon
          points="0,235 90,175 230,210 380,115 535,195 695,82 860,112 1040,96 1200,145 1200,360 0,360"
          fill="url(#hillGrad1)"
        />
        <polygon
          points="0,265 320,230 620,245 890,225 1200,255 1200,450 0,450"
          fill="#3f592c"
        />
        <ellipse cx="980" cy="315" rx="260" ry="70" fill="#8b7d5b" />
        <rect x="1055" y="345" width="75" height="24" fill="#e2e8f0" />
        <polygon points="1048,345 1092,330 1138,345" fill="#c2593f" />
      </g>

      {mountainReveal < 0.95 && (
        <rect
          x="0"
          y="0"
          width="1200"
          height="345"
          fill="#0b1120"
          fillOpacity={0.9 * (1 - mountainReveal)}
        />
      )}

      {/* VALLE Y ARBOLEDA */}
      <rect x="0" y="340" width="1200" height="335" fill="#4c6b30" />
      <polygon
        points="110,450 340,395 960,400 1035,615 695,660 220,525"
        fill={isProposal ? '#64748b' : '#cbd5e1'}
      />
      <polyline
        points="110,452 225,515 445,565 735,610 805,670"
        fill="none"
        stroke={isProposal ? '#475569' : '#b4533c'}
        strokeWidth="12"
      />

      {/* EDIFICIO SECUNDARIO (4 PISOS) */}
      <g transform="translate(350, 315)">
        <polygon points="0,22 175,16 175,105 0,110" fill="#f1f5f9" stroke="#94a3b8" />
        <polygon points="-18,28 0,22 0,110 -18,114" fill="#cbd5e1" />
        <polygon points="4,15 22,14 22,109 4,110" fill="#0c4a6e" />
        {[34, 54, 74, 92].map((y, idx) => (
          <polygon
            key={`s-${idx}`}
            points={`25,${y} 170,${y - 4} 170,${y + 7} 25,${y + 11}`}
            fill="#1e293b"
          />
        ))}
        {!isProposal ? (
          <g>
            <polygon points="22,3 158,-2 158,16 22,21" fill="#dc2626" />
            <text
              x="90"
              y="13"
              fill="#ffffff"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
            >
              CAMPUS HUARAZ
            </text>
          </g>
        ) : (
          <g>
            <polygon points="15,6 165,1 165,16 15,21" fill="#78350f" />
            <rect x="22" y="13" width="140" height="5" fill="#10b981" />
          </g>
        )}
      </g>

      {/* EDIFICIO PRINCIPAL (6 PISOS - B Y A) */}
      <g transform="translate(555, 248)">
        <polygon points="-10,12 18,-6 435,12 415,32" fill="#334155" />
        <polygon points="-10,12 12,24 12,186 -10,170" fill="#cbd5e1" />
        <polygon points="12,24 418,32 415,205 12,186" fill="#f8fafc" />
        <polygon points="12,24 42,25 42,187 12,186" fill="#0f2942" />
        <text x="27" y="54" fill="#ef4444" fontSize="18" fontWeight="bold" textAnchor="middle">
          B
        </text>
        <polygon points="178,27 222,28 221,196 178,194" fill="#075985" />
        <polygon points="376,31 418,32 415,205 375,203" fill="#0f2942" />
        <text x="396" y="64" fill="#ef4444" fontSize="18" fontWeight="bold" textAnchor="middle">
          A
        </text>
        {!isProposal && (
          <>
            <rect x="380" y="95" width="32" height="6" fill="#dc2626" />
            <rect x="393" y="95" width="6" height="85" fill="#dc2626" />
          </>
        )}
        {[0, 1, 2, 3, 4, 5].map((floor) => {
          const yTop = 34 + floor * 26;
          return (
            <g key={`f-${floor}`}>
              {[48, 80, 112, 144, 230, 266, 302, 338].map((x, colIdx) => {
                const hasCyan = !isProposal && colIdx % 2 === 1;
                return (
                  <g key={`w-${floor}-${colIdx}`}>
                    <rect x={x} y={yTop} width="26" height="15" fill="#1e293b" />
                    <rect
                      x={x}
                      y={yTop + 15}
                      width="26"
                      height="8"
                      fill={hasCyan ? '#0284c7' : isProposal ? '#b45309' : '#e2e8f0'}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
      </g>

      {/* EXPLANADA ACTUAL VS PROPUESTA */}
      {!isProposal ? (
        <g>
          <polygon points="480,455 695,468 685,492 470,478" fill="#0284c7" />
          <polygon points="730,482 865,492 855,522 720,510" fill="#0284c7" />
        </g>
      ) : (
        <g>
          <polygon points="450,455 880,475 850,585 430,535" fill="#15803d" fillOpacity="0.8" />
          <rect x="520" y="470" width="65" height="26" rx="4" fill="#92400e" />
          <rect x="640" y="480" width="75" height="28" rx="4" fill="#92400e" />
          <rect x="755" y="492" width="65" height="26" rx="4" fill="#92400e" />
        </g>
      )}

      {/* Árboles centrales y Torre de Telecomunicaciones */}
      <g transform="translate(595, 555)">
        <circle cx="0" cy="0" r="36" fill="#1e3a1e" />
        <circle cx="35" cy="12" r="32" fill="#2d5429" />
        <circle cx="-28" cy="15" r="28" fill="#254622" />
      </g>
      <g transform="translate(310, 415)">
        {[0, 1, 2, 3, 4, 5, 6].map((seg) => (
          <polygon
            key={`t-${seg}`}
            points={`${-4 - seg * 1.5},${seg * 34} ${4 + seg * 1.5},${seg * 34} ${
              6 + seg * 1.5
            },${(seg + 1) * 34} ${-6 - seg * 1.5},${(seg + 1) * 34}`}
            fill="none"
            stroke={seg % 2 === 0 ? '#dc2626' : '#f8fafc'}
            strokeWidth="4.5"
          />
        ))}
      </g>
    </svg>
  );
};

// ============================================================================
// 4. VISOR 3D DE ALTA DENSIDAD (ESTILO FOTOGRAMETRÍA + ENTORNO HUARAZ)
// ============================================================================

const Campus3DViewer = ({
  campusMode,
  setCampusMode,
  splitComparison,
  setSplitComparison,
  selectedMarker,
  setSelectedMarker,
  showLabels,
  setShowLabels,
  categoryFilter,
  setCategoryFilter,
  customGlbUrl
}) => {
  const mountRef = useRef(null);
  const [splitSliderPos, setSplitSliderPos] = useState(50);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isLoading3D, setIsLoading3D] = useState(true);
  const [projectedMarkers, setProjectedMarkers] = useState([]);
  const [activePreset, setActivePreset] = useState('drone');
  // Por defecto inicia en modo 'estudio' idéntico a la imagen de fotogrametría enviada
  const [environmentMode, setEnvironmentMode] = useState('estudio'); // 'estudio' | 'dia' | 'atardecer'
  const [renderStyle, setRenderStyle] = useState('textured'); // 'textured' | 'clay' | 'wireframe'

  const sceneStateRef = useRef({
    spherical: { radius: 29, phi: 1.08, theta: -0.42 },
    targetSpherical: { radius: 29, phi: 1.08, theta: -0.42 },
    lookAt: new THREE.Vector3(1.2, 2.5, 1.2),
    targetLookAt: new THREE.Vector3(1.2, 2.5, 1.2),
    morphProgress: 0,
    isDragging: false,
    prevMouse: { x: 0, y: 0 },
    currentGroup: null,
    proposalGroup: null,
    surroundingsGroup: null,
    dioramaRoot: null,
    scene: null,
    sunLight: null,
    ambientLight: null,
    hemiLight: null
  });

  const modeRef = useRef(campusMode);
  const splitRef = useRef(splitComparison);
  const splitPosRef = useRef(splitSliderPos);

  useEffect(() => {
    modeRef.current = campusMode;
  }, [campusMode]);

  useEffect(() => {
    splitRef.current = splitComparison;
  }, [splitComparison]);

  useEffect(() => {
    splitPosRef.current = splitSliderPos;
  }, [splitSliderPos]);

  // Cambiar entre Modo Estudio Fotogramétrico (fondo gris oscuro limpio como la imagen) y Entorno Cordillera
  useEffect(() => {
    const st = sceneStateRef.current;
    if (!st.scene || !st.sunLight || !st.ambientLight) return;

    if (environmentMode === 'estudio') {
      // En el modo estudio dejamos transparente el canvas para que se luzca el degradado radial gris carbón idéntico a la imagen
      st.scene.background = null;
      st.scene.fog = null;
      if (st.surroundingsGroup) st.surroundingsGroup.visible = false;
      st.sunLight.color.set('#ffffff');
      st.sunLight.intensity = 2.0;
      st.sunLight.position.set(22, 42, 28);
      st.ambientLight.color.set('#f1f5f9');
      st.ambientLight.intensity = 1.15;
    } else if (environmentMode === 'dia') {
      st.scene.background = new THREE.Color('#38bdf8');
      st.scene.fog = new THREE.FogExp2('#bae6fd', 0.005);
      if (st.surroundingsGroup) st.surroundingsGroup.visible = true;
      st.sunLight.color.set('#fffef5');
      st.sunLight.intensity = 2.15;
      st.sunLight.position.set(28, 46, 30);
      st.ambientLight.color.set('#e0f2fe');
      st.ambientLight.intensity = 0.9;
    } else {
      st.scene.background = new THREE.Color('#1e1b4b');
      st.scene.fog = new THREE.FogExp2('#fb923c', 0.006);
      if (st.surroundingsGroup) st.surroundingsGroup.visible = true;
      st.sunLight.color.set('#fdba74');
      st.sunLight.intensity = 2.3;
      st.sunLight.position.set(-35, 22, 24);
      st.ambientLight.color.set('#fed7aa');
      st.ambientLight.intensity = 0.7;
    }
  }, [environmentMode]);

  // Cambiar modo de sombreado (Texturizado Fotogramétrico / Arcilla MatCap / Wireframe) como en el dock inferior de la imagen
  useEffect(() => {
    const st = sceneStateRef.current;
    if (!st.dioramaRoot) return;

    st.dioramaRoot.traverse((child) => {
      if (child.isMesh) {
        if (!child.userData.origMaterial) {
          child.userData.origMaterial = child.material;
        }
        if (renderStyle === 'textured') {
          child.material = child.userData.origMaterial;
          child.material.wireframe = false;
        } else if (renderStyle === 'clay') {
          if (!child.userData.clayMaterial) {
            child.userData.clayMaterial = new THREE.MeshStandardMaterial({
              color: '#d6d3d1',
              roughness: 0.42,
              metalness: 0.08
            });
          }
          child.material = child.userData.clayMaterial;
        } else if (renderStyle === 'wireframe') {
          child.material = child.userData.origMaterial;
          child.material.wireframe = true;
        }
      }
    });
  }, [renderStyle]);

  // Acercar suavemente la cámara al seleccionar un punto
  useEffect(() => {
    if (!selectedMarker) return;
    const st = sceneStateRef.current;
    const [tx, ty, tz] = selectedMarker.cameraTarget;
    const [px, py, pz] = selectedMarker.cameraPos;

    st.targetLookAt.set(tx, ty, tz);
    const offset = new THREE.Vector3(px - tx, py - ty, pz - tz);
    const radius = offset.length();
    const phi = Math.acos(Math.min(Math.max(offset.y / radius, -0.99), 0.99));
    const theta = Math.atan2(offset.x, offset.z);

    st.targetSpherical = { radius, phi, theta };
    setActivePreset('custom');
  }, [selectedMarker]);

  const handleCameraPreset = (preset) => {
    setActivePreset(preset);
    setSelectedMarker(null);
    const st = sceneStateRef.current;

    if (preset === 'frontal') {
      st.targetLookAt.set(2.5, 3.6, 0.8);
      st.targetSpherical = { radius: 24, phi: 1.34, theta: 0.02 };
    } else if (preset === 'aerea') {
      st.targetLookAt.set(1.0, 2.0, 1.5);
      st.targetSpherical = { radius: 36, phi: 0.58, theta: -0.25 };
    } else if (preset === 'lateral') {
      st.targetLookAt.set(2.0, 3.5, 0.8);
      st.targetSpherical = { radius: 27, phi: 1.18, theta: 0.68 };
    } else if (preset === 'drone') {
      // Exactamente el ángulo isométrico 3/4 de la imagen de fotogrametría enviada
      st.targetLookAt.set(1.2, 2.5, 1.2);
      st.targetSpherical = { radius: 29, phi: 1.08, theta: -0.42 };
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (err) {
      setWebglSupported(false);
      setIsLoading3D(false);
      return;
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    sceneStateRef.current.scene = scene;

    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.5,
      300
    );

    // ------------------------------------------------------------------------
    // 1. ILUMINACIÓN DE ESTUDIO FOTOGRAMÉTRICO + LUZ DIRECCIONAL CON SOMBRAS
    // ------------------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight('#f1f5f9', 1.15);
    scene.add(ambientLight);
    sceneStateRef.current.ambientLight = ambientLight;

    const hemiLight = new THREE.HemisphereLight('#ffffff', '#334155', 0.65);
    scene.add(hemiLight);
    sceneStateRef.current.hemiLight = hemiLight;

    const sunLight = new THREE.DirectionalLight('#ffffff', 2.0);
    sunLight.position.set(22, 42, 28);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 5;
    sunLight.shadow.camera.far = 120;
    const d = 28;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);
    sceneStateRef.current.sunLight = sunLight;

    // Luz de contra suave para resaltar las aristas blancas y azules del edificio
    const rimLight = new THREE.DirectionalLight('#bae6fd', 0.65);
    rimLight.position.set(-25, 18, -20);
    scene.add(rimLight);

    // Texturas de alta resolución inspiradas en la captura fotogramétrica
    const groundActualTex = createPhotogrammetryGroundTexture(false);
    const groundProposalTex = createPhotogrammetryGroundTexture(true);
    const whiteRoofTex = createCorrugatedWhiteRoofTexture();
    const sideWallActualTex = createSideWallBlueTexture(false);
    const sideWallProposalTex = createSideWallBlueTexture(true);
    const steppedPierTex = createSteppedWhitePierTexture();
    const recessedBayTex = createRecessedBalconyBayTexture();
    const secFacadeActualTex = createSecondaryBuildingFacadeTexture(false);
    const secFacadeProposalTex = createSecondaryBuildingFacadeTexture(true);

    // Contenedor raíz del diorama para aplicar modos de visualización
    const dioramaRoot = new THREE.Group();
    scene.add(dioramaRoot);
    sceneStateRef.current.dioramaRoot = dioramaRoot;

    // ------------------------------------------------------------------------
    // 2. ISLA RECORTADA DEL LOTE (SILUETA EXACTA DE LA IMAGEN FOTOGRAMÉTRICA)
    // ------------------------------------------------------------------------
    const createSiteIslandMesh = (tex) => {
      const islandShape = new THREE.Shape();
      // Contorno orgánico irregular igual al recorte de fotogrametría de la imagen enviada
      islandShape.moveTo(-14.8, -4.2);
      islandShape.lineTo(15.2, -3.5);
      islandShape.lineTo(15.6, 2.8);
      islandShape.lineTo(5.8, 4.4);
      islandShape.lineTo(3.8, 8.6);
      islandShape.lineTo(1.2, 9.2);
      islandShape.lineTo(-1.8, 7.6);
      islandShape.lineTo(-4.8, 10.6);
      islandShape.lineTo(-8.6, 10.8);
      islandShape.lineTo(-13.8, 7.8);
      islandShape.lineTo(-13.5, 3.8);
      islandShape.lineTo(-14.6, 1.2);
      islandShape.closePath();

      const extrudeSettings = {
        depth: 0.36,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.14,
        bevelThickness: 0.14
      };
      const geo = new THREE.ExtrudeGeometry(islandShape, extrudeSettings);
      geo.rotateX(Math.PI / 2);

      // Mapear coordenadas UV normalizadas sobre la isla
      const pos = geo.attributes.position;
      const uvs = [];
      for (let i = 0; i < pos.count; i++) {
        const u = (pos.getX(i) + 16) / 32;
        const v = (pos.getZ(i) + 5) / 17;
        uvs.push(u, v);
      }
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.88,
        metalness: 0.04
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = 0.18;
      mesh.receiveShadow = true;
      return mesh;
    };

    // ------------------------------------------------------------------------
    // 3. EDIFICIO PRINCIPAL (6 PISOS) CON VOLÚMENES ESCALONADOS, GALERÍAS Y TECHO BLANCO
    // ------------------------------------------------------------------------
    const whiteWallMat = new THREE.MeshStandardMaterial({
      color: '#f1f5f9',
      roughness: 0.38
    });
    const steppedPierMat = new THREE.MeshStandardMaterial({
      map: steppedPierTex,
      roughness: 0.38
    });
    const recessedBayMat = new THREE.MeshStandardMaterial({
      map: recessedBayTex,
      roughness: 0.16,
      metalness: 0.72
    });
    const ucvDeepBlueMat = new THREE.MeshStandardMaterial({
      color: '#0e2a66',
      roughness: 0.32,
      metalness: 0.18
    });
    const coreGreenGlassMat = new THREE.MeshStandardMaterial({
      color: '#0f4c5c',
      roughness: 0.12,
      metalness: 0.85
    });
    const railingGlassMat = new THREE.MeshStandardMaterial({
      color: '#cbd5e1',
      transparent: true,
      opacity: 0.55,
      roughness: 0.2,
      metalness: 0.5
    });
    const whiteRoofMat = new THREE.MeshStandardMaterial({
      map: whiteRoofTex,
      roughness: 0.45,
      metalness: 0.15
    });

    const mainBuilding = new THREE.Group();
    mainBuilding.position.set(4.5, 0, -0.4);

    // Cuerpo interior remetido con ventanales verdosos/oscuros de aulas
    const recessedCore = new THREE.Mesh(
      new THREE.BoxGeometry(19.0, 7.6, 3.8),
      recessedBayMat
    );
    recessedCore.position.set(0, 3.8, -0.15);
    recessedCore.castShadow = true;
    recessedCore.receiveShadow = true;
    mainBuilding.add(recessedCore);

    // Losas blancas de balcones y barandas en los 6 niveles (crean la profundidad real de la fachada)
    for (let f = 0; f <= 6; f++) {
      const y = 0.1 + f * 1.25;
      const floorSlab = new THREE.Mesh(
        new THREE.BoxGeometry(19.2, 0.2, 4.35),
        whiteWallMat
      );
      floorSlab.position.set(0, y, 0.05);
      floorSlab.castShadow = true;
      floorSlab.receiveShadow = true;
      mainBuilding.add(floorSlab);

      // Barandas de balcones en las bahías abiertas
      if (f > 0 && f < 6) {
        [-5.2, -1.9, 2.2, 5.8].forEach((bx) => {
          const railing = new THREE.Mesh(
            new THREE.BoxGeometry(2.1, 0.42, 0.08),
            railingGlassMat
          );
          railing.position.set(bx, y + 0.3, 2.15);
          mainBuilding.add(railing);
        });
      }
    }

    // Volúmenes blancos verticales escalonados con ventanitas cuadradas (Exactamente como en la imagen 3D)
    const pierPositions = [-7.1, -3.55, 4.0, 7.35];
    pierPositions.forEach((px, idx) => {
      const pierGroup = new THREE.Group();
      // Cuerpo saliente blanco con ventanitas cuadradas perforadas
      const mainPier = new THREE.Mesh(
        new THREE.BoxGeometry(1.55, 7.65, 0.72),
        steppedPierMat
      );
      mainPier.position.set(0, 3.82, 2.02);
      mainPier.castShadow = true;
      mainPier.receiveShadow = true;
      pierGroup.add(mainPier);

      // Recortes y cajas blancas escalonadas que le dan relieve tridimensional
      for (let f = 1; f <= 5; f++) {
        const stepBox = new THREE.Mesh(
          new THREE.BoxGeometry(0.65, 0.95, 0.35),
          whiteWallMat
        );
        stepBox.position.set(
          (f + idx) % 2 === 0 ? -0.42 : 0.42,
          f * 1.25 + 0.5,
          2.32
        );
        stepBox.castShadow = true;
        pierGroup.add(stepBox);
      }

      pierGroup.position.x = px;
      mainBuilding.add(pierGroup);
    });

    // === NÚCLEO CENTRAL SALIENTE AZUL Y CRISTAL VERDOSO (Escaleras / Hall central) ===
    const centralTowerGroup = new THREE.Group();
    centralTowerGroup.position.set(-0.2, 0, 0.38);

    const towerGlassShaft = new THREE.Mesh(
      new THREE.BoxGeometry(2.35, 7.9, 4.55),
      coreGreenGlassMat
    );
    towerGlassShaft.position.y = 3.95;
    towerGlassShaft.castShadow = true;
    centralTowerGroup.add(towerGlassShaft);

    // Bandas horizontales azul intenso que envuelven el núcleo central en cada piso
    for (let f = 1; f <= 6; f++) {
      const blueBand = new THREE.Mesh(
        new THREE.BoxGeometry(2.45, 0.42, 4.65),
        ucvDeepBlueMat
      );
      blueBand.position.y = f * 1.25;
      blueBand.castShadow = true;
      centralTowerGroup.add(blueBand);
    }

    // Pórtico de ingreso en planta baja debajo del núcleo central
    const entranceCanopy = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.25, 1.4),
      ucvDeepBlueMat
    );
    entranceCanopy.position.set(0, 1.35, 2.5);
    centralTowerGroup.add(entranceCanopy);

    mainBuilding.add(centralTowerGroup);

    // === FLANCO IZQUIERDO AZUL (BLOQUE B) + PUENTE AÉREO ===
    const leftBlueWing = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 7.75, 4.5),
      ucvDeepBlueMat
    );
    leftBlueWing.position.set(-9.15, 3.88, 0.05);
    leftBlueWing.castShadow = true;
    mainBuilding.add(leftBlueWing);

    // Puente aéreo / marquesina elevada que conecta hacia el edificio secundario (visible en la imagen)
    const skyBridge = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.18, 0.65),
      new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.6, roughness: 0.3 })
    );
    skyBridge.position.set(-10.4, 6.2, 1.6);
    skyBridge.rotation.z = 0.06;
    mainBuilding.add(skyBridge);

    // === FLANCO DERECHO AZUL CON VENTANAS CENTRALES (BLOQUE A - Igual a la imagen) ===
    const rightFlankActualMat = new THREE.MeshStandardMaterial({
      map: sideWallActualTex,
      roughness: 0.35
    });
    const rightSideWall = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 7.75, 4.55),
      rightFlankActualMat
    );
    rightSideWall.position.set(9.1, 3.88, 0.05);
    rightSideWall.castShadow = true;
    mainBuilding.add(rightSideWall);

    // Friso institucional superior azul y blanco bajo la cornisa del techo
    const topFrieze = new THREE.Mesh(
      new THREE.BoxGeometry(19.6, 0.32, 4.58),
      ucvDeepBlueMat
    );
    topFrieze.position.set(0, 7.72, 0.06);
    mainBuilding.add(topFrieze);

    // === TECHO BLANCO A DOS AGUAS SUAVES CON LUCERNARIO CENTRAL (Exacto a la imagen) ===
    const roofGroup = new THREE.Group();
    roofGroup.position.set(0, 7.9, 0.05);

    const roofSlopeFront = new THREE.Mesh(
      new THREE.BoxGeometry(19.7, 0.18, 2.38),
      whiteRoofMat
    );
    roofSlopeFront.position.set(0, 0.18, 1.12);
    roofSlopeFront.rotation.x = 0.11;
    roofSlopeFront.castShadow = true;
    roofSlopeFront.receiveShadow = true;

    const roofSlopeBack = new THREE.Mesh(
      new THREE.BoxGeometry(19.7, 0.18, 2.38),
      whiteRoofMat
    );
    roofSlopeBack.position.set(0, 0.18, -1.12);
    roofSlopeBack.rotation.x = -0.11;
    roofSlopeBack.castShadow = true;
    roofSlopeBack.receiveShadow = true;

    // Cumbrera elevada sobre la sección derecha/central como en la fotogrametría
    const roofRidgeCap = new THREE.Mesh(
      new THREE.BoxGeometry(11.2, 0.26, 1.45),
      whiteRoofMat
    );
    roofRidgeCap.position.set(2.4, 0.35, 0);

    roofGroup.add(roofSlopeFront, roofSlopeBack, roofRidgeCap);
    mainBuilding.add(roofGroup);

    dioramaRoot.add(mainBuilding);

    // ------------------------------------------------------------------------
    // 4. EDIFICIO SECUNDARIO EN ÁNGULO (4 PISOS - "CAMPUS HUARAZ")
    // ------------------------------------------------------------------------
    const secBuilding = new THREE.Group();
    secBuilding.position.set(-9.4, 0, -0.5);
    secBuilding.rotation.y = 0.18; // Ligero giro real respecto al pabellón principal

    const secMainBody = new THREE.Mesh(
      new THREE.BoxGeometry(6.8, 4.9, 3.6),
      new THREE.MeshStandardMaterial({ map: secFacadeActualTex, roughness: 0.32 })
    );
    secMainBody.position.y = 2.45;
    secMainBody.castShadow = true;
    secMainBody.receiveShadow = true;
    secBuilding.add(secMainBody);

    // Balcones blancos salientes en la esquina derecha del edificio secundario
    for (let f = 1; f <= 3; f++) {
      const cornerBalcony = new THREE.Mesh(
        new THREE.BoxGeometry(1.45, 0.42, 3.85),
        whiteWallMat
      );
      cornerBalcony.position.set(2.85, f * 1.15 + 0.2, 0.08);
      cornerBalcony.castShadow = true;
      secBuilding.add(cornerBalcony);
    }

    // Techo blanco del edificio secundario
    const secWhiteRoof = new THREE.Mesh(
      new THREE.BoxGeometry(7.0, 0.2, 3.8),
      whiteRoofMat
    );
    secWhiteRoof.position.y = 4.98;
    secBuilding.add(secWhiteRoof);

    // Camioneta blanca estacionada frente al edificio secundario (visible en la imagen)
    const whiteVan = new THREE.Group();
    const vanBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.45, 0.58, 0.68),
      whiteWallMat
    );
    vanBody.position.y = 0.35;
    whiteVan.add(vanBody);
    whiteVan.position.set(-10.8, 0.2, 2.3);
    whiteVan.rotation.y = 0.25;
    dioramaRoot.add(secBuilding, whiteVan);

    // ========================================================================
    // 5. MODO 1: "LO QUE VEMOS" (EXPLANADA ACTUAL CON CARPA, MUROS AZULES Y EVENTO)
    // ========================================================================
    const currentGroup = new THREE.Group();

    // Isla de terreno fotogramétrico actual
    currentGroup.add(createSiteIslandMesh(groundActualTex));

    // === CARPA / TOLDO BLANCO Y AZUL DE EVENTOS EN LA IZQUIERDA (Idéntica a la imagen) ===
    const eventTentGroup = new THREE.Group();
    eventTentGroup.position.set(-9.4, 0.25, 6.2);
    eventTentGroup.rotation.y = 0.52;

    // Paredes laterales azules de la carpa con pilares blancos
    const tentBlueBase = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 1.05, 3.5),
      new THREE.MeshStandardMaterial({ color: '#1d4ed8', roughness: 0.5 })
    );
    tentBlueBase.position.y = 0.52;
    tentBlueBase.castShadow = true;
    eventTentGroup.add(tentBlueBase);

    // Techo blanco/plateado a dos aguas de la carpa
    const tentRoofGeo = new THREE.CylinderGeometry(2.55, 2.55, 4.65, 3);
    const tentRoofMesh = new THREE.Mesh(tentRoofGeo, whiteRoofMat);
    tentRoofMesh.rotation.z = Math.PI / 2;
    tentRoofMesh.rotation.x = Math.PI / 6;
    tentRoofMesh.scale.set(0.36, 1, 0.88);
    tentRoofMesh.position.y = 1.38;
    tentRoofMesh.castShadow = true;
    eventTentGroup.add(tentRoofMesh);

    // Pórtico azul publicitario UCV y tótem rojo junto a la carpa (exacto a la imagen)
    const blueStagePortal = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 1.35, 0.45),
      new THREE.MeshStandardMaterial({ color: '#1e3a8a', roughness: 0.4 })
    );
    blueStagePortal.position.set(1.6, 0.68, 2.1);
    eventTentGroup.add(blueStagePortal);

    const redMascotTotem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.22, 1.1, 12),
      new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.4 })
    );
    redMascotTotem.position.set(2.9, 0.75, 1.65);
    eventTentGroup.add(redMascotTotem);

    currentGroup.add(eventTentGroup);

    // === MUROS PERIMÉTRICOS AZULES Y RAMPA AZUL FRONTAL (Exactos a la imagen) ===
    const wallBlueMat = new THREE.MeshStandardMaterial({
      color: '#1e40af',
      roughness: 0.45
    });

    // Muros azules en zigzag que rodean el patio de tierra/césped
    const wallSegments = [
      [-5.6, 4.2, 3.2, 0.52],
      [-2.4, 4.8, 5.2, -0.38],
      [-7.4, 3.8, 2.4, -0.95]
    ];
    wallSegments.forEach(([wx, wz, wl, rotY]) => {
      const wMesh = new THREE.Mesh(
        new THREE.BoxGeometry(wl, 0.72, 0.18),
        wallBlueMat
      );
      wMesh.position.set(wx, 0.6, wz);
      wMesh.rotation.y = rotY;
      wMesh.castShadow = true;
      currentGroup.add(wMesh);
    });

    // Rampa / recinto rectangular con paredes azules frente al núcleo central
    const blueRampEnclosure = new THREE.Group();
    blueRampEnclosure.position.set(1.9, 0.25, 6.8);
    blueRampEnclosure.rotation.y = -0.38;

    const rampFloor = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 0.16, 1.55),
      new THREE.MeshStandardMaterial({ color: '#1e3a8a', roughness: 0.6 })
    );
    const rampWallFront = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 0.68, 0.16),
      wallBlueMat
    );
    rampWallFront.position.set(0, 0.34, 0.72);
    const rampWallBack = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 0.68, 0.16),
      wallBlueMat
    );
    rampWallBack.position.set(0, 0.34, -0.72);
    blueRampEnclosure.add(rampFloor, rampWallFront, rampWallBack);
    currentGroup.add(blueRampEnclosure);

    // === BANDEROLAS Y MULTITUD DE ESTUDIANTES A ESCALA EN EL PATIO (Como en la imagen) ===
    const flagMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', side: THREE.DoubleSide });
    [
      [-2.8, 5.4],
      [-2.1, 5.7],
      [-1.4, 6.0],
      [-0.7, 6.3]
    ].forEach(([fx, fz], idx) => {
      const banner = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.12, 1.45, 6),
        idx % 2 === 0 ? flagMat : new THREE.MeshStandardMaterial({ color: '#dc2626' })
      );
      banner.position.set(fx, 0.95, fz);
      banner.castShadow = true;
      currentGroup.add(banner);
    });

    // Pequeñas figuras humanas a escala distribuidas por el patio (dan la escala fotogramétrica exacta)
    const personColors = ['#1e293b', '#f8fafc', '#334155', '#0284c7', '#475569'];
    for (let p = 0; p < 58; p++) {
      const px = -7.8 + (p % 11) * 0.68 + (Math.random() - 0.5) * 0.35;
      const pz = 5.4 + Math.floor(p / 11) * 0.78 + (Math.random() - 0.5) * 0.35;
      const person = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.05, 0.28, 6),
        new THREE.MeshStandardMaterial({ color: personColors[p % personColors.length] })
      );
      body.position.y = 0.14;
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 6, 6),
        new THREE.MeshStandardMaterial({ color: '#e2e8f0' })
      );
      head.position.y = 0.31;
      person.add(body, head);
      person.position.set(px, 0.26, pz);
      person.castShadow = true;
      currentGroup.add(person);
    }

    dioramaRoot.add(currentGroup);
    sceneStateRef.current.currentGroup = currentGroup;

    // ========================================================================
    // 6. MODO 2: "LO QUE IMAGINAMOS" (PROPUESTA ORDENADA E INTEGRADA A HUARAZ)
    // ========================================================================
    const proposalGroup = new THREE.Group();

    // Isla de terreno con jardines andinos y piedra local
    proposalGroup.add(createSiteIslandMesh(groundProposalTex));

    const warmWoodMat = new THREE.MeshStandardMaterial({
      color: '#92400e',
      roughness: 0.5
    });
    const nativeGrassMat = new THREE.MeshStandardMaterial({
      color: '#15803d',
      roughness: 0.85
    });
    const andeanStoneMat = new THREE.MeshStandardMaterial({
      color: '#475569',
      roughness: 0.9
    });

    // Celosías continuas de madera andina que ordenan la fachada principal
    for (let f = 1; f <= 5; f++) {
      const woodLouver = new THREE.Mesh(
        new THREE.BoxGeometry(17.2, 0.28, 0.24),
        warmWoodMat
      );
      woodLouver.position.set(4.5, f * 1.25 + 0.35, 2.05);
      proposalGroup.add(woodLouver);
    }

    // Terraza-Mirador verde con pérgola sobre el Edificio Secundario
    const secRoofGarden = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 0.22, 3.2),
      nativeGrassMat
    );
    secRoofGarden.position.set(-9.4, 5.15, -0.5);
    secRoofGarden.rotation.y = 0.18;

    const secPergola = new THREE.Mesh(
      new THREE.BoxGeometry(6.0, 0.18, 2.6),
      warmWoodMat
    );
    secPergola.position.set(-9.4, 6.05, -0.5);
    secPergola.rotation.y = 0.18;
    proposalGroup.add(secRoofGarden, secPergola);

    // Pérgolas bioclimáticas de madera y piedra en la plaza (en lugar de la carpa cerrada)
    [
      [-7.8, 6.2, 0.35],
      [-3.5, 6.8, -0.15],
      [1.2, 6.4, -0.35]
    ].forEach(([px, pz, rotY]) => {
      const pavilion = new THREE.Group();
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.18, 2.2),
        andeanStoneMat
      );
      const canopy = new THREE.Mesh(
        new THREE.BoxGeometry(3.4, 0.16, 2.4),
        warmWoodMat
      );
      canopy.position.y = 1.45;
      canopy.castShadow = true;
      pavilion.add(base, canopy);
      pavilion.position.set(px, 0.3, pz);
      pavilion.rotation.y = rotY;
      proposalGroup.add(pavilion);
    });

    // Árboles nativos (Quenuales y Alisos) integrados en la plaza abierta
    const createNativeTree = (x, z, scale = 1) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1 * scale, 0.16 * scale, 1.2 * scale, 7),
        warmWoodMat
      );
      trunk.position.y = 0.6 * scale;
      const foliage = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.85 * scale, 1),
        new THREE.MeshStandardMaterial({
          color: '#166534',
          roughness: 0.8,
          flatShading: true
        })
      );
      foliage.position.y = 1.45 * scale;
      foliage.castShadow = true;
      tree.add(trunk, foliage);
      tree.position.set(x, 0.25, z);
      return tree;
    };

    [
      [-10.5, 5.2, 0.9],
      [-6.0, 4.8, 1.0],
      [-5.2, 8.2, 0.85],
      [-1.2, 5.2, 0.95],
      [2.8, 4.8, 0.9]
    ].forEach(([tx, tz, sc]) => {
      proposalGroup.add(createNativeTree(tx, tz, sc));
    });

    dioramaRoot.add(proposalGroup);
    sceneStateRef.current.proposalGroup = proposalGroup;

    // ------------------------------------------------------------------------
    // 7. ENTORNO OPCIONAL: CORDILLERA BLANCA Y VALLE DE HUARAZ
    // ------------------------------------------------------------------------
    const surroundingsGroup = new THREE.Group();
    surroundingsGroup.visible = false; // Inicia en Modo Estudio Fotogramétrico limpio

    const createMountainRange = (width, depth, segW, segD, zOffset, maxHeight, isSnowRange) => {
      const geo = new THREE.PlaneGeometry(width, depth, segW, segD);
      const pos = geo.attributes.position;
      const colors = [];
      const colorTmp = new THREE.Color();

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const edgeX = 1 - Math.pow(x / (width * 0.5), 4);
        const edgeY = Math.sin(((y + depth * 0.5) / depth) * Math.PI);
        const env = Math.max(0, edgeX * edgeY);
        const n1 = 1 - Math.abs(Math.sin(x * 0.065 + 0.4) * Math.cos(y * 0.07));
        const n2 = 0.5 * (1 - Math.abs(Math.sin(x * 0.14 - y * 0.11)));
        const h = Math.max(0, (n1 + n2) * maxHeight * env);
        pos.setZ(i, h);

        if (isSnowRange) {
          colorTmp.set(h > maxHeight * 0.48 ? '#ffffff' : h > maxHeight * 0.3 ? '#cbd5e1' : '#57534e');
        } else {
          colorTmp.set(h > maxHeight * 0.45 ? '#786646' : '#3f5a2a');
        }
        colors.push(colorTmp.r, colorTmp.g, colorTmp.b);
      }

      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.85,
          flatShading: true
        })
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(0, -0.2, zOffset);
      return mesh;
    };

    const valleyFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(220, 220),
      new THREE.MeshStandardMaterial({ color: '#3f592c', roughness: 0.95 })
    );
    valleyFloor.rotation.x = -Math.PI / 2;
    valleyFloor.position.y = -0.05;

    surroundingsGroup.add(
      valleyFloor,
      createMountainRange(150, 45, 80, 30, -28, 20, false),
      createMountainRange(190, 60, 95, 36, -60, 44, true)
    );
    scene.add(surroundingsGroup);
    sceneStateRef.current.surroundingsGroup = surroundingsGroup;

    setIsLoading3D(false);

    // ------------------------------------------------------------------------
    // CONTROLES DE CÁMARA SUAVES
    // ------------------------------------------------------------------------
    const domElem = renderer.domElement;

    const onPointerDown = (e) => {
      sceneStateRef.current.isDragging = true;
      sceneStateRef.current.prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      if (!sceneStateRef.current.isDragging) return;
      const dx = e.clientX - sceneStateRef.current.prevMouse.x;
      const dy = e.clientY - sceneStateRef.current.prevMouse.y;
      sceneStateRef.current.prevMouse = { x: e.clientX, y: e.clientY };

      const st = sceneStateRef.current;
      st.targetSpherical.theta -= dx * 0.0065;
      st.targetSpherical.phi = Math.max(
        0.35,
        Math.min(1.48, st.targetSpherical.phi - dy * 0.0055)
      );
      setActivePreset('custom');
    };

    const onPointerUp = () => {
      sceneStateRef.current.isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      const st = sceneStateRef.current;
      st.targetSpherical.radius = Math.max(
        11,
        Math.min(55, st.targetSpherical.radius + e.deltaY * 0.025)
      );
    };

    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ------------------------------------------------------------------------
    // BUCLE DE RENDERIZADO Y ANIMACIÓN
    // ------------------------------------------------------------------------
    let animFrameId;
    const tempVec = new THREE.Vector3();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const st = sceneStateRef.current;

      st.spherical.radius += (st.targetSpherical.radius - st.spherical.radius) * 0.08;
      st.spherical.phi += (st.targetSpherical.phi - st.spherical.phi) * 0.08;
      st.spherical.theta += (st.targetSpherical.theta - st.spherical.theta) * 0.08;
      st.lookAt.lerp(st.targetLookAt, 0.08);

      const { radius, phi, theta } = st.spherical;
      camera.position.x = st.lookAt.x + radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = st.lookAt.y + radius * Math.cos(phi);
      camera.position.z = st.lookAt.z + radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(st.lookAt);

      const targetMorph = modeRef.current === 'imaginamos' ? 1 : 0;
      st.morphProgress += (targetMorph - st.morphProgress) * 0.08;

      // Actualizar textura del flanco derecho y edificio secundario según el modo
      rightSideWall.material.map =
        st.morphProgress > 0.5 ? sideWallProposalTex : sideWallActualTex;
      secMainBody.material.map =
        st.morphProgress > 0.5 ? secFacadeProposalTex : secFacadeActualTex;

      const width = container.clientWidth;
      const height = container.clientHeight;

      if (splitRef.current) {
        renderer.setScissorTest(true);
        const splitX = Math.floor((splitPosRef.current / 100) * width);

        currentGroup.visible = true;
        proposalGroup.visible = false;
        currentGroup.scale.y = 1;
        renderer.setScissor(0, 0, splitX, height);
        renderer.render(scene, camera);

        currentGroup.visible = false;
        proposalGroup.visible = true;
        proposalGroup.scale.y = 1;
        renderer.setScissor(splitX, 0, width - splitX, height);
        renderer.render(scene, camera);

        renderer.setScissorTest(false);
      } else {
        renderer.setScissorTest(false);
        const p = st.morphProgress;
        currentGroup.visible = p < 0.98;
        proposalGroup.visible = p > 0.02;
        currentGroup.scale.y = Math.max(0.01, 1 - p * 0.95);
        proposalGroup.scale.y = Math.max(0.01, p);
        renderer.render(scene, camera);
      }

      const updatedMarkers = ANALYSIS_MARKERS.map((m) => {
        tempVec.set(m.position[0], m.position[1], m.position[2]);
        tempVec.project(camera);
        const x = (tempVec.x * 0.5 + 0.5) * width;
        const y = (-(tempVec.y * 0.5) + 0.5) * height;
        const isBehind = tempVec.z > 1;
        return {
          ...m,
          screenX: x,
          screenY: y,
          visible: !isBehind && x > 24 && x < width - 24 && y > 24 && y < height - 24
        };
      });
      setProjectedMarkers(updatedMarkers);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domElem.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, [customGlbUrl]);

  const filteredMarkers = useMemo(() => {
    if (categoryFilter === 'todos') return projectedMarkers;
    return projectedMarkers.filter((m) => m.category === categoryFilter);
  }, [projectedMarkers, categoryFilter]);

  const stepMarker = (dir) => {
    const list =
      categoryFilter === 'todos'
        ? ANALYSIS_MARKERS
        : ANALYSIS_MARKERS.filter((m) => m.category === categoryFilter);
    const currentIdx = list.findIndex((m) => m.id === selectedMarker?.id);
    const nextIdx = (currentIdx + dir + list.length) % list.length;
    const nextItem = list[nextIdx];
    setSelectedMarker(nextItem);
    if (nextItem.category === 'propuesta') {
      setCampusMode('imaginamos');
    } else {
      setCampusMode('vemos');
    }
  };

  return (
    <div
      className="relative w-full h-[680px] lg:h-[760px] rounded-[2rem] overflow-hidden border border-white/15 shadow-[0_30px_100px_rgba(0,0,0,0.85)]"
      style={{
        // Fondo gris carbón radial idéntico a la captura de fotogrametría enviada
        background:
          'radial-gradient(circle at 50% 48%, #383b40 0%, #25272b 58%, #181a1d 100%)'
      }}
    >
      {webglSupported ? (
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        <CampusDroneVisual
          mode={campusMode === 'imaginamos' ? 'propuesta' : 'actual'}
          mountainReveal={1}
        />
      )}

      {/* INDICADOR SUPERIOR DERECHO DE VÉRTICES (Exacto a la referencia enviada) */}
      <div className="absolute top-3 right-5 z-20 pointer-events-none hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-300/80">
        <span>Vertices 1007047 / 1007047</span>
      </div>

      {isLoading3D && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center z-40">
          <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white font-semibold tracking-widest uppercase text-xs">
            Cargando Modelo Fotogramétrico UCV Huaraz...
          </p>
        </div>
      )}

      {/* BARRA DESLIZANTE DE COMPARACIÓN 50/50 */}
      {splitComparison && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_25px_rgba(255,255,255,1)]"
            style={{ left: `${splitSliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-950/95 border-2 border-white flex items-center justify-center shadow-2xl">
              <Columns className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="absolute top-24 left-6 bg-slate-950/85 backdrop-blur-md border border-orange-500/40 px-4 py-1.5 rounded-full text-xs font-bold text-orange-300 uppercase tracking-wider">
            Modo 1: Lo que vemos (Actual)
          </div>
          <div className="absolute top-24 right-6 bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-300 uppercase tracking-wider">
            Modo 2: Lo que imaginamos (Propuesta)
          </div>
          <input
            type="range"
            min="10"
            max="90"
            value={splitSliderPos}
            onChange={(e) => setSplitSliderPos(Number(e.target.value))}
            aria-label="Comparar campus actual y propuesta"
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize pointer-events-auto"
          />
        </div>
      )}

      {/* MARCADORES 3D FLOTANTES */}
      {showLabels &&
        !splitComparison &&
        filteredMarkers.map((marker) => {
          if (!marker.visible) return null;
          const isSelected = selectedMarker?.id === marker.id;

          const badgeStyle =
            marker.category === 'bueno'
              ? 'bg-sky-500 border-sky-200 text-slate-950 shadow-sky-500/50'
              : marker.category === 'malo'
              ? 'bg-orange-500 border-orange-200 text-slate-950 shadow-orange-500/50'
              : 'bg-emerald-500 border-emerald-200 text-slate-950 shadow-emerald-500/50';

          return (
            <button
              key={marker.id}
              onClick={() => setSelectedMarker(marker)}
              style={{ left: `${marker.screenX}px`, top: `${marker.screenY}px` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-200 ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-110'
              }`}
            >
              <span
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border-2 font-extrabold text-[11px] shadow-xl ${badgeStyle}`}
              >
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                <span className="hidden sm:inline whitespace-nowrap">{marker.title}</span>
              </span>
            </button>
          );
        })}

      {/* BARRA SUPERIOR: INTERRUPTOR "DOS MIRADAS, UN MISMO CAMPUS" */}
      <div className="absolute top-8 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-2xl border border-white/15 p-1.5 rounded-2xl flex items-center gap-1 shadow-2xl">
          <button
            onClick={() => {
              setSplitComparison(false);
              setCampusMode('vemos');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all ${
              !splitComparison && campusMode === 'vemos'
                ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>MODO 1: LO QUE VEMOS</span>
          </button>

          <button
            onClick={() => {
              setSplitComparison(false);
              setCampusMode('imaginamos');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all ${
              !splitComparison && campusMode === 'imaginamos'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>MODO 2: LO QUE IMAGINAMOS</span>
          </button>

          <button
            onClick={() => setSplitComparison(!splitComparison)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              splitComparison
                ? 'bg-white text-slate-950 shadow-lg'
                : 'text-slate-300 hover:text-white border-l border-white/10'
            }`}
          >
            <Columns className="w-4 h-4" />
            <span className="hidden md:inline">Comparar 50/50</span>
          </button>
        </div>

        {/* Filtros de Puntos */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="bg-slate-950/85 backdrop-blur-2xl border border-white/15 p-1.5 rounded-2xl flex items-center gap-1">
            {[
              { id: 'todos', label: 'Todos', dot: 'bg-white' },
              { id: 'bueno', label: 'Lo Bueno', dot: 'bg-sky-400' },
              { id: 'malo', label: 'Lo Malo', dot: 'bg-orange-400' },
              { id: 'propuesta', label: 'Propuestas', dot: 'bg-emerald-400' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  categoryFilter === tab.id
                    ? 'bg-white/15 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${tab.dot}`} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`p-1.5 rounded-xl transition ${
                showLabels ? 'bg-white/15 text-white' : 'text-slate-500 hover:text-white'
              }`}
              title="Mostrar/Ocultar marcadores"
            >
              <Tag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* TARJETA FLOTANTE DEL PUNTO SELECCIONADO */}
      {selectedMarker && (
        <div className="absolute bottom-20 right-4 left-4 sm:left-auto sm:w-[400px] z-30 bg-slate-950/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 shadow-2xl">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                selectedMarker.category === 'bueno'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : selectedMarker.category === 'malo'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {selectedMarker.categoryLabel} • {selectedMarker.zone}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => stepMarker(-1)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300"
                title="Punto anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => stepMarker(1)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300"
                title="Siguiente punto"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedMarker(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h4 className="text-lg font-extrabold text-white mb-1.5">{selectedMarker.title}</h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
            {selectedMarker.fullDesc}
          </p>

          <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-3 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block mb-0.5">
              Nuestra mirada propositiva
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {selectedMarker.proposalChange}
            </p>
          </div>

          <button
            onClick={() =>
              setCampusMode(campusMode === 'vemos' ? 'imaginamos' : 'vemos')
            }
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider transition hover:opacity-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {campusMode === 'vemos'
                ? 'Transformar a Lo que Imaginamos'
                : 'Volver a Lo que Vemos'}
            </span>
          </button>
        </div>
      )}

      {/* BARRA INFERIOR ESTILO VISOR FOTOGRAMÉTRICO (Como en tu imagen de referencia) */}
      <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Vistas de cámara */}
        <div className="pointer-events-auto bg-black/60 backdrop-blur-2xl border border-white/10 p-1.5 rounded-full flex items-center gap-1">
          {[
            { id: 'drone', label: 'Isométrica 3D' },
            { id: 'frontal', label: 'Frontal' },
            { id: 'aerea', label: 'Aérea' },
            { id: 'lateral', label: 'Lateral' }
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => handleCameraPreset(v.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                activePreset === v.id
                  ? 'bg-white text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Dock Central de Esferas Fotogramétricas (Idéntico al dock inferior de la imagen) */}
        <div className="pointer-events-auto bg-black/65 backdrop-blur-2xl border border-white/15 px-4 py-2 rounded-full flex items-center gap-3 shadow-2xl">
          {/* Esferas de modo de malla / material */}
          <button
            onClick={() => setRenderStyle('textured')}
            className={`w-6 h-6 rounded-full bg-gradient-to-tr from-sky-500 via-white to-blue-700 border-2 transition ${
              renderStyle === 'textured' ? 'border-white scale-110' : 'border-transparent opacity-60'
            }`}
            title="Textura Fotogramétrica Realista"
          />
          <button
            onClick={() => setRenderStyle('clay')}
            className={`w-6 h-6 rounded-full bg-gradient-to-tr from-stone-500 via-stone-300 to-stone-100 border-2 transition ${
              renderStyle === 'clay' ? 'border-white scale-110' : 'border-transparent opacity-60'
            }`}
            title="Modo Arcilla / MatCap Arquitectónico"
          />
          <button
            onClick={() => setRenderStyle('wireframe')}
            className={`w-6 h-6 rounded-full bg-slate-900 border-2 flex items-center justify-center transition ${
              renderStyle === 'wireframe'
                ? 'border-sky-400 scale-110 text-sky-400'
                : 'border-white/30 text-slate-400 opacity-70'
            }`}
            title="Malla Poligonal (Wireframe)"
          >
            <Grid className="w-3 h-3" />
          </button>

          <div className="w-px h-5 bg-white/20 mx-1" />

          {/* Esferas de entorno (Estudio Gris Oscuro vs Valle Cordillera vs Atardecer) */}
          <button
            onClick={() => setEnvironmentMode('estudio')}
            className={`w-6 h-6 rounded-full bg-gradient-to-b from-zinc-500 to-zinc-900 border-2 transition ${
              environmentMode === 'estudio'
                ? 'border-white scale-110'
                : 'border-transparent opacity-60'
            }`}
            title="Estudio Fotogramétrico (Fondo Gris Oscuro)"
          />
          <button
            onClick={() => setEnvironmentMode('dia')}
            className={`w-6 h-6 rounded-full bg-gradient-to-b from-sky-300 to-emerald-700 border-2 transition ${
              environmentMode === 'dia'
                ? 'border-white scale-110'
                : 'border-transparent opacity-60'
            }`}
            title="Entorno Cordillera Blanca (Día)"
          />
          <button
            onClick={() => setEnvironmentMode('atardecer')}
            className={`w-6 h-6 rounded-full bg-gradient-to-b from-amber-400 to-indigo-950 border-2 transition ${
              environmentMode === 'atardecer'
                ? 'border-white scale-110'
                : 'border-transparent opacity-60'
            }`}
            title="Atardecer en Huaraz"
          />
        </div>

        {/* Botón para mostrar/ocultar etiquetas y ver el modelo 100% limpio como en la foto */}
        <div className="pointer-events-auto">
          <button
            onClick={() => {
              setShowLabels(!showLabels);
              if (showLabels) setSelectedMarker(null);
            }}
            className="bg-black/60 backdrop-blur-xl border border-white/15 px-3.5 py-2 rounded-full text-xs font-semibold text-slate-200 hover:text-white transition"
          >
            {showLabels ? 'Ver Modelo Limpio (Sin Etiquetas)' : 'Mostrar Puntos de Análisis'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. APLICACIÓN PRINCIPAL (SIN EL PUNTO 5)
// ============================================================================

export default function App() {
  const [campusMode, setCampusMode] = useState('vemos');
  const [splitComparison, setSplitComparison] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null); // Inicia limpio para apreciar el modelado 3D como en la foto
  const [showLabels, setShowLabels] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('todos');

  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [mountainReveal, setMountainReveal] = useState(0.15);
  const [activeBalanceSide, setActiveBalanceSide] = useState('rescatamos');
  const [selectedRescatamos, setSelectedRescatamos] = useState(BALANCE_DATA.rescatamos[0]);
  const [selectedCambiariamos, setSelectedCambiariamos] = useState(BALANCE_DATA.cambiariamos[0]);
  const [proposalSlider, setProposalSlider] = useState(50);

  const [showResourceDrawer, setShowResourceDrawer] = useState(false);
  const [customVideoUrl, setCustomVideoUrl] = useState(null);
  const [customGlbUrl, setCustomGlbUrl] = useState(null);

  const handleHeroMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    setMouseOffset({
      x: (e.clientX / innerWidth - 0.5) * 22,
      y: (e.clientY / innerHeight - 0.5) * 14
    });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const focusMarkerIn3D = (marker) => {
    if (!marker) return;
    setSelectedMarker(marker);
    setShowLabels(true);
    setSplitComparison(false);
    setCampusMode(marker.category === 'propuesta' ? 'imaginamos' : 'vemos');
    scrollToSection('seccion-3d');
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 font-sans selection:bg-sky-400 selection:text-slate-950 overflow-x-hidden">
      {/* =================================================================== */}
      {/* HEADER MINIMALISTA DE EXPOSICIÓN INTERNACIONAL (4 SECCIONES)        */}
      {/* =================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#060911]/75 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('portada')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-black text-slate-950 tracking-tighter shadow-lg shadow-sky-500/20">
              CF
            </div>
            <div>
              <span className="block text-sm font-black tracking-widest text-white group-hover:text-sky-400 transition">
                CAOS FUNCIONAL
              </span>
              <span className="block text-[10px] font-mono text-slate-400">
                UCV HUARAZ • EL PINAR
              </span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <button onClick={() => scrollToSection('seccion-3d')} className="hover:text-white transition">
              01. Modelo 3D
            </button>
            <button onClick={() => scrollToSection('seccion-percepcion')} className="hover:text-white transition">
              02. Percepción
            </button>
            <button onClick={() => scrollToSection('seccion-entorno')} className="hover:text-white transition">
              03. Entorno
            </button>
            <button onClick={() => scrollToSection('seccion-propuesta')} className="hover:text-emerald-400 transition">
              04. Propuesta
            </button>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowResourceDrawer(true)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Recursos / GLB</span>
            </button>
            <button
              onClick={() => scrollToSection('seccion-3d')}
              className="px-4 py-1.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-sky-500/25"
            >
              Explorar 3D
            </button>
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* 1. PORTADA CINEMATOGRÁFICA                                          */}
      {/* =================================================================== */}
      <section
        id="portada"
        onMouseMove={handleHeroMouseMove}
        className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
      >
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out scale-105"
          style={{
            transform: `translate(${mouseOffset.x * -0.5}px, ${mouseOffset.y * -0.5}px) scale(1.06)`
          }}
        >
          {customVideoUrl ? (
            <video
              src={customVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <CampusDroneVisual mode="actual" mountainReveal={1} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-[#060911]/70 to-[#060911]/45" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#060911_95%)]" />
        </div>

        <div
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center"
          style={{
            transform: `translate(${mouseOffset.x * 0.3}px, ${mouseOffset.y * 0.3}px)`
          }}
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/75 border border-white/15 backdrop-blur-xl text-[11px] font-mono text-sky-300 uppercase tracking-widest mb-8">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>{PROJECT_INFO.coordinates}</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.95]">
            CAOS{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400">
              FUNCIONAL
            </span>
          </h1>

          <p className="text-xl sm:text-3xl font-light text-slate-100 max-w-3xl mx-auto mb-5 leading-relaxed">
            {PROJECT_INFO.subtitle}
          </p>

          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-400 font-semibold mb-12">
            “{PROJECT_INFO.tagline}”
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('seccion-3d')}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-sm sm:text-base tracking-wider uppercase transition-all shadow-[0_0_50px_rgba(56,189,248,0.45)]"
            >
              <span>EXPLORAR EL CAMPUS</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection('seccion-percepcion')}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-xl text-slate-200 text-sm font-semibold transition"
            >
              <span>Nuestra Percepción</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. EXPERIENCIA 3D FOTOGRAMÉTRICA                                    */}
      {/* =================================================================== */}
      <section id="seccion-3d" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-sky-400 block mb-2">
              01 // MODELADO FOTOGRAMÉTRICO INTERACTIVO
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              DOS MIRADAS, UN MISMO CAMPUS
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
            Inspecciona el campus en modo{' '}
            <strong className="text-white">Estudio Fotogramétrico</strong> o activa el entorno de la
            Cordillera Blanca desde la barra inferior de esferas.
          </p>
        </div>

        <Campus3DViewer
          campusMode={campusMode}
          setCampusMode={setCampusMode}
          splitComparison={splitComparison}
          setSplitComparison={setSplitComparison}
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
          showLabels={showLabels}
          setShowLabels={setShowLabels}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          customGlbUrl={customGlbUrl}
        />

        {/* MENSAJE DE SÍNTESIS DE LA COMPARACIÓN 3D */}
        <div className="mt-8 bg-gradient-to-r from-slate-900/90 via-sky-950/30 to-emerald-950/30 border border-white/10 rounded-3xl p-6 sm:p-8 text-center">
          <p className="text-base sm:text-xl font-black text-white tracking-wide max-w-3xl mx-auto">
            {PROJECT_INFO.comparisonFinalQuote}
          </p>
          <p className="text-xs text-sky-400 mt-1.5 uppercase tracking-widest font-semibold">
            {PROJECT_INFO.comparisonFinalSub}
          </p>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. NUESTRA PERCEPCIÓN + BALANCE INTERACTIVO INTEGRADO               */}
      {/* =================================================================== */}
      <section
        id="seccion-percepcion"
        className="py-24 px-4 sm:px-6 bg-gradient-to-b from-[#060911] via-[#0b1222] to-[#060911] border-y border-white/5"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Columna Editorial: ¿Por qué Caos Funcional? */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-sky-400 block">
              02 // NUESTRA PERCEPCIÓN
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              ¿POR QUÉ CAOS FUNCIONAL?
            </h2>

            <div className="space-y-5 text-base sm:text-xl font-light leading-relaxed text-slate-300">
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                <p>
                  “Nosotros vemos el campus de la UCV como una{' '}
                  <strong className="text-white font-semibold">
                    construcción moderna y bastante llamativa
                  </strong>
                  . Nos gusta su tamaño y cómo destaca en la zona, pero al mismo tiempo sentimos
                  que tiene{' '}
                  <strong className="text-orange-400 font-semibold">
                    demasiadas cosas juntas
                  </strong>
                  . Entre ventanas, colores, bloques y anuncios, parece que todo quiere llamar la
                  atención.”
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                <p>
                  “Lo que más nos hace pensar es que{' '}
                  <strong className="text-emerald-300 font-semibold">
                    estamos en Huaraz, rodeados de montañas y paisajes increíbles
                  </strong>
                  , pero sentimos que la universidad no aprovecha mucho ese entorno en su diseño.”
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-sky-500/10 border border-sky-500/30">
                <p>
                  “Por eso decidimos llamarlo{' '}
                  <strong className="text-sky-400 font-bold">Caos Funcional</strong>. Porque,
                  aunque visualmente nos parece algo desordenado, al final{' '}
                  <strong className="text-white font-semibold">
                    sigue funcionando como una universidad
                  </strong>
                  . No creemos que todo esté mal, simplemente pensamos que podría ser mucho mejor.”
                </p>
              </div>
            </div>
          </div>

          {/* Columna Interactiva: Lo que rescatamos vs Lo que cambiaríamos */}
          <div className="lg:col-span-5 bg-slate-950/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-2">
              BALANCE DE DOS COLUMNAS
            </span>
            <h3 className="text-2xl font-black text-white mb-6">
              Lo que rescatamos vs. Lo que cambiaríamos
            </h3>

            {/* Selector de las 2 columnas */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-sky-500/10 border border-sky-500/30 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs uppercase mb-2.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lo que rescatamos</span>
                </div>
                <div className="space-y-1.5">
                  {BALANCE_DATA.rescatamos.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveBalanceSide('rescatamos');
                        setSelectedRescatamos(item);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition ${
                        activeBalanceSide === 'rescatamos' && selectedRescatamos.id === item.id
                          ? 'bg-sky-400 text-slate-950'
                          : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 text-orange-400 font-bold text-xs uppercase mb-2.5">
                  <Sliders className="w-4 h-4" />
                  <span>Lo que cambiaríamos</span>
                </div>
                <div className="space-y-1.5">
                  {BALANCE_DATA.cambiariamos.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveBalanceSide('cambiariamos');
                        setSelectedCambiariamos(item);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition ${
                        activeBalanceSide === 'cambiariamos' &&
                        selectedCambiariamos.id === item.id
                          ? 'bg-orange-400 text-slate-950'
                          : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Explicación breve activa */}
            <div
              className={`rounded-2xl p-5 border ${
                activeBalanceSide === 'rescatamos'
                  ? 'bg-sky-950/30 border-sky-500/40'
                  : 'bg-orange-950/30 border-orange-500/40'
              }`}
            >
              <span
                className={`text-[10px] font-mono uppercase tracking-widest block mb-1 ${
                  activeBalanceSide === 'rescatamos' ? 'text-sky-400' : 'text-orange-400'
                }`}
              >
                {activeBalanceSide === 'rescatamos'
                  ? 'PUNTO QUE VALORAMOS'
                  : 'PUNTO QUE MEJORARÍAMOS'}
              </span>
              <h4 className="text-lg font-bold text-white mb-1.5">
                {activeBalanceSide === 'rescatamos'
                  ? selectedRescatamos.title
                  : selectedCambiariamos.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeBalanceSide === 'rescatamos'
                  ? selectedRescatamos.desc
                  : selectedCambiariamos.desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. EL CAMPUS Y SU ENTORNO ("Estamos en Huaraz. ¿Por qué no...")      */}
      {/* =================================================================== */}
      <section id="seccion-entorno" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block">
              03 // EL CAMPUS Y SU ENTORNO
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              “Estamos en Huaraz. ¿Por qué no se siente así?”
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed bg-white/[0.03] border-l-4 border-emerald-400 p-5 rounded-r-2xl">
              “Para nosotros, una universidad ubicada en Huaraz debería aprovechar más el paisaje
              que tiene alrededor. No se trata de llenar todo de montañas dibujadas, sino de hacer
              que el campus tenga una relación más clara con el lugar donde está.”
            </p>

            <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase">
                <span className="text-orange-300">1. Edificio aislado</span>
                <span className="text-emerald-300">2. Cordillera Blanca detrás</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(mountainReveal * 100)}
                onChange={(e) => setMountainReveal(Number(e.target.value) / 100)}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setMountainReveal(0.05)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-200 transition"
                >
                  Ver solo edificio
                </button>
                <button
                  onClick={() => setMountainReveal(1)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-xs font-black text-slate-950 transition"
                >
                  Aparición de montañas
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative rounded-[2rem] overflow-hidden border border-white/15 shadow-2xl aspect-video bg-slate-950">
              <CampusDroneVisual mode="actual" mountainReveal={mountainReveal} />
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-2xl flex items-center justify-between text-xs">
                <span className="text-slate-200 font-medium">
                  {mountainReveal < 0.4
                    ? 'Sin el fondo natural, la fachada parece pensada para cualquier avenida costera.'
                    : 'Al aparecer la Cordillera Blanca y El Pinar, se nota la desconexión con el paisaje.'}
                </span>
                <span className="text-emerald-400 font-mono font-bold ml-3">
                  {Math.round(mountainReveal * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. NUESTRA PROPUESTA ("¿Y SI EL CAMPUS FUERA DIFERENTE?")           */}
      {/* =================================================================== */}
      <section
        id="seccion-propuesta"
        className="py-24 px-4 sm:px-6 bg-[#090e1a] border-y border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-2">
                04 // PROPUESTA CONCEPTUAL
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white">
                “¿Y SI EL CAMPUS FUERA DIFERENTE?”
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              Desliza el comparador para contrastar la referencia actual con nuestra visualización
              conceptual.
            </p>
          </div>

          {/* COMPARADOR VISUAL ANTES / PROPUESTA */}
          <div className="relative rounded-[2rem] overflow-hidden border border-white/15 shadow-2xl aspect-video max-w-5xl mx-auto mb-12 select-none">
            <div className="absolute inset-0">
              <CampusDroneVisual mode="propuesta" mountainReveal={1} />
            </div>
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - proposalSlider}% 0 0)` }}
            >
              <CampusDroneVisual mode="actual" mountainReveal={1} />
            </div>
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_rgba(255,255,255,0.9)] pointer-events-none"
              style={{ left: `${proposalSlider}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-slate-950 border-2 border-white flex items-center justify-center text-white shadow-xl">
                <Columns className="w-5 h-5" />
              </div>
            </div>

            <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md border border-orange-500/40 px-4 py-1.5 rounded-full text-xs font-bold text-orange-300 uppercase">
              ANTES (Estado Actual)
            </div>
            <div className="absolute top-4 right-4 bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-300 uppercase">
              PROPUESTA (Visualización Conceptual)
            </div>

            <input
              type="range"
              min="5"
              max="95"
              value={proposalSlider}
              onChange={(e) => setProposalSlider(Number(e.target.value))}
              aria-label="Comparador Antes y Propuesta"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />
          </div>

          {/* 4 TARJETAS PRINCIPALES DE PROPUESTA CON ENLACE DIRECTO AL MODELO 3D */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                num: '01',
                title: 'Fachada más ordenada',
                desc: 'Conservamos el azul y blanco UCV integrando celosías continuas sin elementos que compitan.',
                markerId: 'prop-1'
              },
              {
                num: '02',
                title: 'Plaza central con vegetación',
                desc: 'Reemplazamos las carpas cerradas y muros duros por un parque universitario con flora andina.',
                markerId: 'prop-2'
              },
              {
                num: '03',
                title: 'Vistas hacia las montañas',
                desc: 'Convertimos la cubierta del edificio secundario en una terraza-mirador hacia la Cordillera Blanca.',
                markerId: 'prop-3'
              },
              {
                num: '04',
                title: 'Materiales de Huaraz',
                desc: 'Piedra granítica y madera en muretes, rampas y pérgolas para dialogar con El Pinar.',
                markerId: 'prop-4'
              }
            ].map((p) => (
              <button
                key={p.num}
                onClick={() =>
                  focusMarkerIn3D(ANALYSIS_MARKERS.find((m) => m.id === p.markerId))
                }
                className="text-left bg-white/[0.03] hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-400/50 rounded-3xl p-5 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      PROPUESTA {p.num}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">{p.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 mt-4 inline-block">
                  Ver este cambio en 3D →
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. CIERRE IMPACTANTE                                                */}
      {/* =================================================================== */}
      <section className="relative py-28 px-4 sm:px-6 overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 opacity-35">
          <CampusDroneVisual mode="propuesta" mountainReveal={1} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-[#060911]/85 to-[#060911]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            {PROJECT_INFO.closingQuote}
          </h2>
          <p className="text-base sm:text-xl text-slate-300 mb-10 font-light">
            {PROJECT_INFO.closingSub}
          </p>

          <button
            onClick={() => {
              setCampusMode('imaginamos');
              scrollToSection('seccion-3d');
            }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-sm uppercase tracking-wider transition shadow-[0_0_50px_rgba(56,189,248,0.4)]"
          >
            <Box className="w-5 h-5" />
            <span>REGRESAR A LA EXPERIENCIA 3D</span>
          </button>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <span>CAOS FUNCIONAL — UCV Sede Huaraz (El Pinar)</span>
            <span>{PROJECT_INFO.authors}</span>
          </div>
        </div>
      </section>

      {/* MODAL PARA CARGAR VIDEO DRON O ARCHIVO GLB PROPIO */}
      {showResourceDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-400" />
                <span>Cargar Video Dron o Modelo GLB</span>
              </h3>
              <button
                onClick={() => setShowResourceDrawer(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950 border border-white/10 rounded-2xl p-4">
                <label className="block text-xs font-bold text-sky-400 uppercase mb-2">
                  1. Video Dron para Portada (.mp4)
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setCustomVideoUrl(URL.createObjectURL(file));
                  }}
                  className="text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-sky-400 file:text-slate-950 file:font-bold cursor-pointer"
                />
              </div>

              <div className="bg-slate-950 border border-white/10 rounded-2xl p-4">
                <label className="block text-xs font-bold text-emerald-400 uppercase mb-2">
                  2. Modelo 3D externo (.glb / .gltf)
                </label>
                <input
                  type="file"
                  accept=".glb,.gltf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setCustomGlbUrl(URL.createObjectURL(file));
                  }}
                  className="text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-emerald-400 file:text-slate-950 file:font-bold cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowResourceDrawer(false)}
                className="px-5 py-2 rounded-xl bg-sky-400 text-slate-950 font-bold text-xs uppercase"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}