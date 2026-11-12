import {authConfig} from '../../../../lib/auth-server';
export const dynamic='force-dynamic';
export function GET(){return Response.json({config:authConfig()},{headers:{'Cache-Control':'no-store'}})}
