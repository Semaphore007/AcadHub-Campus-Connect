export const USERNAME_RE = /^[a-z0-9_]{3,20}$/
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function passwordChecks(pw: string) {
  return [
    { label: "At least 8 characters", ok: pw.length >= 8 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(pw) },
    { label: "One number", ok: /\d/.test(pw) },
    { label: "One symbol", ok: /[^A-Za-z0-9]/.test(pw) },
  ]
}

export function passwordScore(pw: string) {
  return passwordChecks(pw).filter((c) => c.ok).length
}
