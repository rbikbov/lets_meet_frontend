export function mungeEmailAddress(email: string, s = '*') {
  const i = email.indexOf('@');
  const startIndex = (i * 0.2) | 0;
  const endIndex = (i * 0.8) | 0;
  return [
    email.slice(0, startIndex),
    email.slice(startIndex, endIndex).replace(/[A-Za-z0-9]/g, s),
    email.slice(endIndex),
  ].join('');
}
