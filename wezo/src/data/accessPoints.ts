/**
 * Cities with a local WEZO access number. Without mobile data, a call is routed through the
 * chosen city's local number. Placeholder list until the access numbers come from the backend.
 */
export type AccessPoint = { id: string; name: string };

export const accessPoints: AccessPoint[] = [
  { id: 'auto', name: 'Automatic (nearest)' },
  { id: 'us-nyc', name: 'New York - Manhattan' },
  { id: 'us-la', name: 'Los Angeles' },
  { id: 'us-chi', name: 'Chicago' },
  { id: 'ca-tor', name: 'Toronto' },
  { id: 'gb-lon', name: 'London' },
  { id: 'se-sto', name: 'Stockholm' },
  { id: 'de-ber', name: 'Berlin' },
  { id: 'ae-dxb', name: 'Dubai' },
  { id: 'ke-nbo', name: 'Nairobi' },
  { id: 'ng-los', name: 'Lagos' },
  { id: 'za-jnb', name: 'Johannesburg' },
];

export function accessPointName(id: string): string {
  return accessPoints.find((a) => a.id === id)?.name ?? accessPoints[0].name;
}
