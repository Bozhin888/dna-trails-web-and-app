import { TRAILS, HOSTS, TYPES, CARS } from '@dna/data';
export function GET() { return Response.json({ trails: TRAILS, hosts: HOSTS, types: TYPES, cars: CARS }); }
