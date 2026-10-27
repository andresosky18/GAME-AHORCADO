import {env} from 'cloudflare:workers';
import {handle} from './handler';
export const dynamic='force-dynamic';
export async function POST(req:Request){if(!env.DB)return Response.json({error:'Sala no disponible.'},{status:503});return handle(req,env.DB);}
