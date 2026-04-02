# Proposed update for ADO User Story #67530

## Title

Proxy administration for System Admins

## Description

As a System Admin,
I want to manage proxy arrangements across the organisation and review proxy requests when approval is required,
so that proxy access stays accurate, controlled, and easy to administer.

### Scope

- System Admins can access proxy administration and manage assignments for all users
- This direct assignment management is available in both **user-managed** and **request-based** organisations
- In **request-based** organisations, System Admins can also review, approve, and reject pending requests for:
  - new proxy assignments
  - edits to existing proxy assignments

### Admin capabilities

- Search, filter, add, edit, and remove proxy assignments across the organisation
- View current proxy arrangements for all users
- Review pending proxy requests when request-based mode is enabled
- Approve or reject pending requests for new assignments and edits

### Notifications

- System Admins receive a daily summary email for pending proxy requests
- The summary is sent only when there is at least one pending request
- The summary is sent at 9am server time, Monday to Friday only
- This notification is email-only

### Acceptance criteria

- In user-managed mode, System Admins can directly create, edit, and cancel proxy assignments for any user
- In request-based mode, System Admins can directly create, edit, and cancel proxy assignments for any user
- In request-based mode, System Admins can review a list of pending requests for new assignments and edits
- In request-based mode, System Admins can approve a pending request and the resulting arrangement or change is applied
- In request-based mode, System Admins can reject a pending request and no change is applied
- The daily summary email is not sent on Saturdays or Sundays
- The daily summary email is not sent when there are zero pending requests
