import {requireAdmin} from '@/lib/auth';
import {AdminShell} from '@/components/admin-shell';
export const dynamic='force-dynamic';
export const metadata={robots:{index:false,follow:false}};
export default async function AdminLayout({children}:{children:React.ReactNode}){const admin=await requireAdmin();return <AdminShell email={admin.email}>{children}</AdminShell>;}
