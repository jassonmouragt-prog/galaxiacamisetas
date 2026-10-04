import {requireAdmin} from '@/lib/auth';
import {getSettings} from '@/lib/repository';
import {SettingsForm} from '@/components/settings-form';
import {PageTitle} from '@/components/ui';
export default async function Settings(){await requireAdmin();const settings=await getSettings();return <><PageTitle title="Configurações" description="Os parâmetros que mantêm cada orçamento na mesma órbita."/><SettingsForm initial={settings}/></>;}
