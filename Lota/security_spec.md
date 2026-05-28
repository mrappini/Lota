# Security Specification - Lota

This document defines the security boundaries, data invariants, and adversarial test scenarios for the Lota application database.

## 1. Data Invariants

1. **Immutability**: Once a report is submitted, it can never be updated or deleted.
2. **Strict Fields**: A report must contain exactly four fields: `status`, `createdAt`, `dayOfWeek`, and `hour`. No additional fields are permitted.
3. **Valid Range**:
   - `status` must be either `'green'`, `'yellow'`, or `'red'`.
   - `dayOfWeek` must be an integer between `0` and `6`.
   - `hour` must be an integer between `0` and `23`.
4. **Server-Side Timestamp**: The `createdAt` field must strictly match the server time (`request.time`). Client-provided dates are rejected to prevent retrospective data submission or future spoofing.

## 2. The "Dirty Dozen" Malicious Payloads

The following attempts must be rejected with `PERMISSION_DENIED`:

1. **The Ghost Field (Shadow Update)**:
   ```json
   { "status": "green", "createdAt": "SERVER_TIMESTAMP", "dayOfWeek": 1, "hour": 14, "malicious_field": "injected" }
   ```
2. **Future Spoofing (Client Timestamp)**:
   ```json
   { "status": "green", "createdAt": "2027-01-01T00:00:00Z", "dayOfWeek": 1, "hour": 14 }
   ```
3. **Status Poisoning**:
   ```json
   { "status": "super-crowded", "createdAt": "SERVER_TIMESTAMP", "dayOfWeek": 1, "hour": 14 }
   ```
4. **Day of Week Lower Bound Violation**:
   ```json
   { "status": "yellow", "createdAt": "SERVER_TIMESTAMP", "dayOfWeek": -1, "hour": 14 }
   ```
5. **Day of Week Upper Bound Violation**:
   ```json
   { "status": "yellow", "createdAt": "SERVER_TIMESTAMP", "dayOfWeek": 7, "hour": 14 }
   ```
6. **Hour Lower Bound Violation**:
   ```json
   { "status": "red", "createdAt": "SERVER_TIMESTAMP", "dayOfWeek": 3, "hour": -1 }
   ```
7. **Hour Upper Bound Violation**:
   ```json
   { "status": "red", "createdAt": "SERVER_TIMESTAMP", "dayOfWeek": 3, "hour": 24 }
   ```
8. **Under-filled Fields Constraint**:
   ```json
   { "status": "green", "dayOfWeek": 2 }
   ```
9. **Tampering / Malicious Update (Update Attempt)**:
   Attempting to modify `status` of an existing record from `green` to `red`.
10. **Malicious Deletion**:
    Attempting to delete a valid record.
11. **Malicious Document ID (ID Poisoning)**:
    Attempting to create a report with a 1MB junk string as the document ID.
12. **Wrong Type Injection**:
    ```json
    { "status": 123, "createdAt": "SERVER_TIMESTAMP", "dayOfWeek": "Monday", "hour": "2:00 PM" }
    ```

## 3. Production security rules: firestore.rules
We will define and deploy `firestore.rules` below.
