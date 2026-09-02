# Firestore Security Specification

## 1. Data Invariants
- Leads can be created by visitors submitting registration interest.
- Document IDs must be valid string identifiers (`isValidId`).
- Payments can be created or queried with matching paymentId and email.
- Student records must validate field lengths, valid statuses, and immutable enrollment timestamps.
- Default deny on all unmatched collections.

## 2. Test Cases ("Dirty Dozen")
1. Anonymous user attempting to write with oversized strings (> 200 chars). (FAIL)
2. Injected junk characters in path/document ID. (FAIL)
3. Modifying immutable creation timestamps during updates. (FAIL)
4. Submitting invalid status enumeration values. (FAIL)
5. Modifying system-controlled or protected student records. (FAIL)
6. Blanket query without proper filters. (FAIL)
7. Missing required fields in lead registration payload. (FAIL)
8. Unauthorized deletion of payment audit records. (FAIL)
9. Tampering with payment amounts after creation. (FAIL)
10. Shadow update with ghost fields on lead records. (FAIL)
11. Unauthenticated reading of private student records. (FAIL)
12. Attempting to write malicious scripts or invalid types into number fields. (FAIL)
