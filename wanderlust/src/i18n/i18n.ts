import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import { en, es, fr } from './translations';

const i18n = new I18n({
  en,
  es,
  fr,
});


i18n.enableFallback = true;
i18n.defaultLocale = 'en';

const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';

const supportedLocales = ['en', 'es', 'fr'];
const locale = supportedLocales.includes(deviceLanguage) ? deviceLanguage : 'en';
i18n.locale = locale;

export const updateLocale = (newLocale: string) => {
  if (supportedLocales.includes(newLocale)) {
    i18n.locale = newLocale;
  }
};

export { i18n, locale as defaultLocale };

