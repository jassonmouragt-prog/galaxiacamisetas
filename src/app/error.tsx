'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="main" className="loading-page"><h1>Não conseguimos carregar esta página.</h1><p>Verifique sua conexão e tente novamente em instantes.</p><button onClick={reset} className="button">Tentar novamente</button></main>;}
