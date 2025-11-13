import { useMemo } from 'react';
import { useExperiments } from '../context/ExperimentContext';
import { i18n } from './i18n';

export const useTranslation = () => {
  const { locale } = useExperiments();

  const t = useMemo(() => {
    i18n.locale = locale;
    
    return (key: string, options?: any) => {
      return i18n.t(key, options);
    };
  }, [locale]);

  return { t, locale };
};
