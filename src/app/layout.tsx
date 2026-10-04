import type { Metadata } from 'next';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/titan-one/400.css';
import './globals.css';
import './brand-refinements.css';
export const metadata: Metadata = { title: {default:'Galáxia Camisetas | Uma galáxia de possibilidades',template:'%s | Galáxia Camisetas'}, description:'Camisetas personalizadas para o seu evento. Monte seu orçamento e converse com a Galáxia.', icons:{icon:'/brand/logo.png'} };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body><a className="skip-link" href="#main">Pular para o conteúdo</a>{children}</body></html>;}
