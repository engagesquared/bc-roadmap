# Proposed update for ADO Feature #67529

## Title

Proxy user improvements

## Description

Improve proxy management so organisations can choose how proxy arrangements are controlled, while keeping System Admins able to manage all assignments and keeping affected users informed by email.

### Scope

- Introduce an organisation-level proxy management mode:
  - **User-managed**
  - **Request-based**
- Ensure System Admins can manage proxy assignments for all users in both modes
- Support end-user proxy management from `/settings`
- Support admin review of proxy requests where approval is required
- Add notification emails for proxy arrangement creation, edit, cancellation, and pending request summaries

### Behaviour summary

**User-managed**

- Users can create, edit, and cancel proxy arrangements involving themselves from `/settings`
- Users can also remove arrangements where they are currently assigned as the proxy for someone else
- No proxy request workflow exists in this mode

**Request-based**

- Users can see current proxy arrangements from `/settings`
- Users can request:
  - a new proxy assignment
  - an edit to an existing proxy assignment
- Users can cancel without approval:
  - assignments where they are being proxied by someone else
  - assignments where they are currently the proxy for someone else
- System Admins review and approve or reject requests for new assignments and edits

### Notifications

- Send an email to both the user and the proxy when a new proxy arrangement is established, including the arrangement details
- Send an email to both the user and the proxy when an existing proxy arrangement is edited, showing the changes
- Send an email to both the user and the proxy when an existing proxy arrangement is cancelled
- Send a daily summary email to System Admins for pending proxy requests at 9am server time, Monday to Friday only, and only when there is at least one pending request
- These notifications are email-only and users cannot opt out of them
