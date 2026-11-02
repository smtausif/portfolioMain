export type SpherePoint = { x: number; y: number; z: number };

export function createSpherePoints(count: number): SpherePoint[] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / count;
    const ring = Math.sqrt(1 - y * y);
    return { x: Math.cos(i * goldenAngle) * ring, y, z: Math.sin(i * goldenAngle) * ring };
  });
}

// Rotate real unit-sphere coordinates about two axes, preserving their radius.
export function rotateSpherePoints(points: SpherePoint[], pitch: number, yaw: number) {
  const cx = Math.cos(pitch), sx = Math.sin(pitch);
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  for (const point of points) {
    const y = point.y * cx - point.z * sx;
    const z = point.y * sx + point.z * cx;
    const x = point.x * cy + z * sy;
    point.z = -point.x * sy + z * cy;
    point.x = x;
    point.y = y;
  }
}
