import type { Shipment, UserProfile } from './types'

/** Backfill new profile fields for data saved before these features existed. */
export function migrateUser(u: UserProfile): UserProfile {
  const suiteCode =
    u.suiteCode?.trim() ||
    `BLM-${u.id.replace(/-/g, '').slice(0, 6).toUpperCase()}`
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

/** Ensure optional shipment fields exist for older saved state. */
export function migrateShipment(s: Shipment): Shipment {
  return {
    ...s,
    overseasPackaging: s.overseasPackaging,
    carePackage: s.carePackage,
    contentNotesByCategory: s.contentNotesByCategory,
  }
}
