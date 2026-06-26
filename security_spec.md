# Firestore Security Specification - Surat Insider

## 1. Data Invariants
- Only Super Admins can write to `experiences` and `auditLogs`.
- Guests can create `inquiries` but cannot read or update them.
- Super Admins can read and update all `inquiries`.
- `experiences` are publicly readable only if `status == "Published"`.
- `auditLogs` are only readable by Super Admins.

## 2. The "Dirty Dozen" Payloads (Deny Cases)
1. Guest attempting to create an experience.
2. Guest attempting to delete an experience.
3. Guest attempting to read `inquiries`.
4. Guest attempting to update an `inquiry` status.
5. Guest attempting to read `auditLogs`.
6. Authenticated user (non-admin) trying to set `status` to "Published" on an experience they didn't create.
7. Admin trying to inject a 2MB string into `experience.title`.
8. User trying to create an inquiry with a missing `email` field.
9. User trying to spoof `inquiry.date` using a client timestamp instead of server timestamp.
10. Attacker trying to delete `auditLogs`.
11. User trying to create an experience with an invalid ID pattern.
12. Admin trying to update `experience.id` (immutability check).

## 3. Test Runner (Conceptual)
Tests would verify that:
- `auth.uid` is checked against an `admins` collection or a hardcoded role check in rules (using `exists`).
- `isValidExperience()` enforces string sizes and required keys.
- `inquiries` are write-only for guests.
