# Proposed update for ADO User Story #67531

## Title

Users manage or request proxy arrangements from settings

## Description

As a user,
I want to manage or request changes to proxy arrangements from `/settings` based on my organisation's proxy management mode,
so that I can keep proxy coverage up to date without relying on support.

### Scope

- Proxy management is exposed in `/settings`
- Behaviour depends on an organisation-level mode:
  - **User-managed**
  - **Request-based**

### User-managed behaviour

- Users can view their current proxy arrangements from `/settings`
- Users can create a new proxy assignment involving themselves
- Users can edit an existing proxy assignment involving themselves
- Users can cancel an assignment where someone is proxying them
- Users can cancel an assignment where they are currently the proxy for someone else
- No approval workflow or request queue exists in this mode

### Request-based behaviour

- Users can view their current proxy arrangements from `/settings`
- Users can request:
  - a new proxy assignment
  - an edit to an existing proxy assignment
- Users can cancel without approval:
  - an assignment where someone is proxying them
  - an assignment where they are currently the proxy for someone else
- Only new assignments and edits require System Admin approval

### Notifications

- When a new proxy arrangement is established, send an email to both the user and the proxy with the arrangement details
- When an existing proxy arrangement is edited, send an email to both the user and the proxy showing what changed
- When an existing proxy arrangement is cancelled, send an email to both the user and the proxy confirming the cancellation
- These notifications are email-only and cannot be opted out of by users

### Acceptance criteria

- In user-managed mode, a user can create a new proxy assignment for themselves from `/settings`
- In user-managed mode, a user can edit an existing proxy assignment involving themselves from `/settings`
- In user-managed mode, a user can cancel an assignment where someone is proxying them from `/settings`
- In user-managed mode, a user can cancel an assignment where they are the assigned proxy for someone else from `/settings`
- In request-based mode, a user can submit a request for a new proxy assignment from `/settings`
- In request-based mode, a user can submit a request to edit an existing proxy assignment from `/settings`
- In request-based mode, a user can cancel an assignment where someone is proxying them without approval
- In request-based mode, a user can cancel an assignment where they are the assigned proxy for someone else without approval
- In request-based mode, a submitted request does not apply until it is approved by a System Admin
- When an arrangement is created, edited, or cancelled, both affected parties receive the corresponding email notification
