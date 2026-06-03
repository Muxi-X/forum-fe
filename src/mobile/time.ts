import moment from 'utils/moment';

const mobileTimeFormats = [
  'YYYY-MM-DD HH:mm:ss',
  'YYYY-MM-DD HH:mm',
  'YYYY/MM/DD HH:mm:ss',
  'YYYY/MM/DD HH:mm',
  'YYYY-MM-DDTHH:mm:ssZ',
  'YYYY-MM-DDTHH:mm:ss.SSSZ',
  'YYYY-MM-DDTHH:mm:ss',
  'YYYY-MM-DDTHH:mm:ss.SSS',
];

export const parseMobileTime = (value?: string | null) => {
  const text = value?.trim();
  if (!text) return 0;

  const strict = moment(text, mobileTimeFormats, true);
  if (strict.isValid()) return strict.valueOf();

  const loose = moment(text);
  return loose.isValid() ? loose.valueOf() : 0;
};
