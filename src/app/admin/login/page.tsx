import {redirect} from 'next/navigation';
import {currentAdmin} from '@/lib/auth';
import {Brand} from '@/components/brand';
import {LoginForm} from '@/components/login-form';
export const dynamic='force-dynamic';
export default async function Login(){const admin=await currentAdmin();if(admin)redirect('/admin');return <main id="main" className="login-page"><div className="login-brand"><Brand large/><h1>Todo grande projeto<br/>começa por aqui.</h1><p>O espaço de quem transforma ideias em camisetas.</p></div><section className="login-panel"><h2>Bem-vindo à equipe.</h2><p>Acesse para acompanhar orçamentos, organizar a produção e cuidar de cada entrega.</p><LoginForm/><small>Acesso exclusivo à equipe Galáxia Camisetas.</small></section></main>;}
