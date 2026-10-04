import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
export async function GET(){try{await query('SELECT id FROM settings WHERE id=1');return NextResponse.json({status:'ok'});}catch{return NextResponse.json({status:'unavailable'},{status:503});}}
