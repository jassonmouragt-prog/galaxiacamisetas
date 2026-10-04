import {PublicHeader,PublicFooter} from '@/components/brand';
import {getSettings} from '@/lib/repository';
import {settingsReady} from '@/lib/domain';
import {Empty} from '@/components/ui';
import {QuoteForm} from '@/components/quote-form';
export const dynamic='force-dynamic';
export default async function QuotePage(){let settings;try{settings=await getSettings();}catch{return <div className="public-world"><PublicHeader/><main id="main" className="content"><Empty title="O orçamento está temporariamente indisponível.">Não conseguimos conectar ao atendimento agora. Tente novamente em instantes.</Empty></main><PublicFooter/></div>;}return <div className="public-world"><PublicHeader/><main id="main" className="quote-container"><div className="quote-heading"><h1>Vamos vestir<br/><span>a sua ideia?</span></h1><p>Conte um pouco sobre o que você imagina.<br/>A gente reúne tudo em um só orçamento.</p></div>{settingsReady(settings)?<QuoteForm settings={settings}/>:<Empty title="Estamos preparando nosso catálogo.">A equipe está atualizando modelos e valores. Volte em breve para montar seu orçamento.</Empty>}</main><PublicFooter/></div>;}
