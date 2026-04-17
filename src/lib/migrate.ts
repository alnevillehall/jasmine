import type { UserProfile } from './types'

/** Backfill new profile fields for data saved before these features existed. */
export function migrateUser(u: UserProfile): UserProfile {
  const suiteCode =
    u.suiteCode?.trim() ||
    `JGL-${u.id.replace(/-/g, '').slice(0, 6).toUpperCase()}`
  const accountStatus = u.accountStatus ?? 'approved'
  const tutorialCompletedAt =
    u.tutorialCompletedAt !== undefined ? u.tutorialCompletedAt : accountStatus === 'approved' ? u.createdAt : null

  return {
    ...u,
    accountStatus,
    suiteCode,
    tutorialCompletedAt,
    idVerification: u.idVerification,
    rejectionReason: u.rejectionReason,
  }
}
