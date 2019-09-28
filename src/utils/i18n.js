import I18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en';
import fr from './locales/fr';
import ger from './locales/ger';
import italy from './locales/italy';
import spanish from './locales/spanish';
import vi from './locales/vi';

const locales = RNLocalize.getLocales();

if (Array.isArray(locales)) {
  I18n.locale = locales[0].languageTag;
}

I18n.fallbacks = true;
I18n.translations = {
  en,
  fr,
  ger,
  italy,
  spanish,
  vi,
};

export default I18n;
