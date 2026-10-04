import { labels } from '@/lib/domain';
import { CircleAlert, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
export function Status({value}:{value:string}){return <span className={`status status-${value.toLowerCase()}`}>{labels[value]??value}</span>;}
export function Empty({title,children}:{title:string;children:React.ReactNode}){return <div className="empty"><CircleAlert size={28} aria-hidden="true"/><h3>{title}</h3><p>{children}</p></div>;}
export function PageTitle({title,description,action}:{title:string;description:string;action?:React.ReactNode}){return <div className="page-title"><div><h1>{title}</h1><p>{description}</p></div>{action}</div>;}
export function DetailLink({href,children}:{href:string;children:React.ReactNode}){return <Link className="text-link" href={href}>{children}<ArrowUpRight size={16} aria-hidden="true"/></Link>;}
