import Image from 'next/image';
import Link from 'next/link';
import {PlanetBrand} from './planet-brand';
export function Brand({ large=false }: {large?:boolean}) { const image=<Image src="/brand/logo.png" alt="Galáxia Camisetas" width={1280} height={1280} priority={large} />;return large?<PlanetBrand>{image}</PlanetBrand>:<Link href="/" className="brand" aria-label="Galáxia Camisetas — início">{image}</Link>; }
export function PublicHeader(){return <header className="public-header"><Brand/><nav aria-label="Navegação principal"><Link href="/#como-funciona">Como funciona</Link><Link href="/orcamento" className="button small">Criar orçamento <span aria-hidden="true">↗</span></Link></nav></header>;}
export function PublicFooter(){return <footer className="public-footer"><span>Galáxia Camisetas · Personalização em cada detalhe.</span><div><Link href="/privacidade">Privacidade</Link><Link href="/admin/login">Acesso da equipe</Link></div></footer>;}
