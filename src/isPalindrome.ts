export function isPalindrome(str: string): boolean {
  const normalized = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return normalized === normalized.split('').reverse().join('');
}
