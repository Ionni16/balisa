import {NextRequest,NextResponse} from 'next/server';
import {supabaseAdmin, getSupabaseErrorMessage} from '@/lib/supabase';
import {DEFAULT_SETTINGS} from '@/lib/settings';

export const dynamic='force-dynamic';
export const revalidate=0;

const ALLOWED=new Set(Object.keys(DEFAULT_SETTINGS));
function clean(body:Record<string,unknown>){
  const out:Record<string,unknown>={};
  for(const[k,v]of Object.entries(body||{})) if(ALLOWED.has(k)) out[k]=typeof v==='string'?v.trim():v;
  out.updated_at=new Date().toISOString();
  return out;
}
export async function GET(){
  if(!supabaseAdmin) return NextResponse.json(DEFAULT_SETTINGS,{headers:{'Cache-Control':'no-store, max-age=0'}});
  const{data,error}=await supabaseAdmin.from('site_settings').select('*').order('updated_at',{ascending:false}).limit(1).maybeSingle();
  if(error)return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json({...DEFAULT_SETTINGS,...(data||{})},{headers:{'Cache-Control':'no-store, max-age=0'}});
}
export async function PATCH(req:NextRequest){
  if(req.headers.get('x-admin-key')!==process.env.ADMIN_SECRET_KEY)return NextResponse.json({error:'Unauthorized'},{status:401});
  if(!supabaseAdmin)return NextResponse.json({error:getSupabaseErrorMessage()},{status:500});
  const body=clean(await req.json());
  const{data:existing}=await supabaseAdmin.from('site_settings').select('id').order('updated_at',{ascending:false}).limit(1).maybeSingle();
  const q=existing?.id?supabaseAdmin.from('site_settings').update(body).eq('id',existing.id):supabaseAdmin.from('site_settings').insert(body);
  const{data,error}=await q.select().single();
  if(error)return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json({...DEFAULT_SETTINGS,...data},{headers:{'Cache-Control':'no-store, max-age=0'}});
}
