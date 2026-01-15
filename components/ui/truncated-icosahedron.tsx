'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

// Funciones matemáticas para la geometría 3D
const deg = (r: number) => (r * 180) / Math.PI;
const rad = (d: number) => (d * Math.PI) / 180;
const vadd = (a: number[], b: number[]) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const vsub = (a: number[], b: number[]) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const vmul = (a: number[], s: number) => [a[0] * s, a[1] * s, a[2] * s];
const vdot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const vcross = (a: number[], b: number[]) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
];
const vlen = (a: number[]) => Math.hypot(a[0], a[1], a[2]);
const vnorm = (a: number[]) => {
    const L = vlen(a) || 1;
    return [a[0] / L, a[1] / L, a[2] / L];
};

function normalToEuler([x, y, z]: number[]) {
    const yaw = Math.atan2(x, z);
    const hyp = Math.hypot(x, z);
    const pitch = Math.atan2(y, hyp);
    return [pitch, yaw];
}

function tangentFrame(n: number[]) {
    const ref = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
    const u = vnorm(vcross(ref, n));
    const v = vnorm(vcross(n, u));
    return { u, v, n };
}

function icosahedron() {
    const φ = (1 + Math.sqrt(5)) / 2;
    const V = [
        [-1, φ, 0], [1, φ, 0], [-1, -φ, 0], [1, -φ, 0],
        [0, -1, φ], [0, 1, φ], [0, -1, -φ], [0, 1, -φ],
        [φ, 0, -1], [φ, 0, 1], [-φ, 0, 1], [-φ, 0, -1]
    ].map(vnorm);
    const F = [
        [0, 10, 5], [0, 5, 1], [0, 1, 7], [0, 7, 11], [0, 11, 10],
        [1, 5, 9], [5, 10, 4], [10, 11, 2], [11, 7, 6], [7, 1, 8],
        [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
        [4, 9, 5], [2, 4, 10], [6, 2, 11], [8, 6, 7], [9, 8, 1]
    ];
    return { V, F };
}

function edgesAndNeighbors(F: number[][], nVerts: number) {
    const nbr = Array.from({ length: nVerts }, () => new Set<number>());
    for (const [a, b, c] of F) {
        const add = (i: number, j: number) => {
            nbr[i].add(j);
            nbr[j].add(i);
        };
        add(a, b); add(b, c); add(c, a);
    }
    const neighbors = nbr.map((s) => Array.from(s));
    return { neighbors };
}

function orderNeighborsCCW(i: number, neighbors: number[][], V: number[][]) {
    const n = V[i];
    const { u, v } = tangentFrame(n);
    const ang = (j: number) => {
        const w = vsub(V[j], n);
        const proj = vsub(w, vmul(n, vdot(w, n)));
        const x = vdot(proj, u), y = vdot(proj, v);
        return Math.atan2(y, x);
    };
    return neighbors[i].slice().sort((a, b) => ang(a) - ang(b));
}

const truncPoint = (Vi: number[], Vj: number[], s: number) => vadd(vmul(Vi, 1 - s), vmul(Vj, s));

interface Face {
    kind: "pent" | "hex";
    verts: number[][];
    n?: number[];
    d?: number;
}

function buildTruncatedIcosahedron(s: number): Face[] {
    const { V, F } = icosahedron();
    const { neighbors } = edgesAndNeighbors(F, V.length);

    const faces: Face[] = [];

    for (let i = 0; i < V.length; i++) {
        const ring = orderNeighborsCCW(i, neighbors, V);
        const verts = ring.map((j) => truncPoint(V[i], V[j], s));
        faces.push({ kind: "pent", verts });
    }

    for (const [a, b, c] of F) {
        const verts = [
            truncPoint(V[a], V[b], s),
            truncPoint(V[b], V[a], s),
            truncPoint(V[b], V[c], s),
            truncPoint(V[c], V[b], s),
            truncPoint(V[c], V[a], s),
            truncPoint(V[a], V[c], s)
        ];
        faces.push({ kind: "hex", verts });
    }

    for (const f of faces) {
        let n = vnorm(vcross(vsub(f.verts[1], f.verts[0]), vsub(f.verts[2], f.verts[0])));
        const avg = f.verts
            .reduce((a, b) => vadd(a, b), [0, 0, 0])
            .map((x) => x / f.verts.length);
        if (vdot(n, avg) < 0) {
            n = vmul(n, -1);
            f.verts.reverse();
        }
        f.n = n;
        f.d = vdot(n, f.verts[0]);
    }
    return faces;
}

function face2D(f: Face) {
    if (!f.n || f.d === undefined) throw new Error("Face normal or distance not set");
    const { u, v, n } = tangentFrame(f.n);
    const p0 = vmul(n, f.d);
    let pts = f.verts.map((p) => {
        const w = vsub(p, p0);
        return [vdot(w, u), vdot(w, v)];
    });
    const c = pts
        .reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
        .map((x) => x / pts.length);
    pts = pts.map(([x, y]) => [x - c[0], y - c[1]]);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const [x, y] of pts) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
    }
    const w = maxX - minX, h = maxY - minY;
    const pts01 = pts.map(([x, y]) => [(x - minX) / w, (y - minY) / h]);
    return { pts01, w, h };
}

interface TruncatedIcosahedronProps {
    logoSrc?: string; // Hacemos el logo opcional y de tipo string
    logoAlt?: string;
    logoWidth?: number;
    logoHeight?: number;
}

export function TruncatedIcosahedron({ logoSrc, logoAlt, logoWidth = 180, logoHeight = 180 }: TruncatedIcosahedronProps) {
    // Valores ajustados para el componente - tamaño más pequeño
    const truncationS = 0.333;
    const scale = 112; // Ajustado para que el balón sea de 180px

    const [faceElements, setFaceElements] = useState<JSX.Element[]>([]);

    const generateFaceElements = useCallback(() => {
        // Usar useMemo para cachear los cálculos pesados
        const faces = buildTruncatedIcosahedron(truncationS);
        // Reducir el número de caras para mejor rendimiento
        const visibleFaces = faces.slice(0, Math.min(faces.length, 20));
        visibleFaces.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "hex" ? -1 : 1));

        const elements = visibleFaces.map((f, index) => {
            const { pts01, w, h } = face2D(f);
            const sizeW = w * scale;
            const sizeH = h * scale;

            const [pitch, yaw] = normalToEuler(f.n!);
            let transformStyle = `rotateY(${deg(yaw)}deg) rotateX(${deg(-pitch)}deg) translateZ(${f.d! * scale}px)`;

            if (f.kind === 'hex' && f.n![0] === 0) {
                transformStyle = `rotateY(${deg(yaw)}deg) rotateX(${deg(-pitch)}deg) rotateZ(${f.n![2] > 0 ? 30 : -30}deg) translateZ(${f.d! * scale}px)`;
            }

            const poly = pts01
                .map(([x, y]) => `${(x * 100).toFixed(3)}% ${(y * 100).toFixed(3)}%`)
                .join(",");

            const faceStyle: React.CSSProperties = {
                width: `${sizeW}px`,
                height: `${sizeH}px`,
                transform: transformStyle,
            };

            const tileStyle: React.CSSProperties = {
                clipPath: `polygon(${poly})`,
                // Cambiando los colores aquí
                background: f.kind === 'pent' ? 'rgba(117, 206, 57, 1)' : 'rgb(0, 102, 204)', // Amarillo para pentágonos, Azul para hexágonos
            };

            return (
                <div className="face" style={faceStyle} key={`${f.kind}-${index}`}>
                    <div className={`tile ${f.kind}`} style={tileStyle}></div>
                </div>
            );
        });
        setFaceElements(elements);
    }, [truncationS, scale]);

    useEffect(() => {
        document.documentElement.style.setProperty("--scale", `${scale}px`);
        generateFaceElements();
    }, [scale, truncationS, generateFaceElements]);

    return (
        <div className="stage-auth">
            <div id="ball" className="ball-auth" aria-label="Truncated icosahedron">
                {faceElements}
            </div>
            {/* Logo siempre visible con el nuevo logo */}
            <Image
                src={logoSrc || "/logo sos@3x.png"}
                alt={logoAlt || "SOS-HABILIDOSO Logo"}
                width={logoWidth}
                height={logoHeight}
                className="logo-auth"
                style={{
                    filter: 'drop-shadow(0 0 3px rgba(0, 255, 136, 0.6))',
                    borderRadius: '50%',
                    aspectRatio: '1/1',
                    objectFit: 'cover',
                }}
                priority
            />
        </div>
    );
}