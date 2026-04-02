---
title: "Proxy management"
summary: "Let each organisation choose whether proxy arrangements are user-managed or request-based, while giving System Admins full oversight and keeping both sides informed by email."
---

Let each organisation choose whether proxy arrangements are managed directly by users or handled through an approval workflow, while keeping System Admins in control and both parties informed of every change.

> **Note:** The screenshots below are early mockups used to explore the design direction. The final implementation may look different and the feature set may be adjusted based on feedback and technical constraints.

### What's changing

**Configurable proxy management mode**

Proxy management can be configured in one of two ways for each organisation:

- **User-managed** - users manage proxy arrangements directly from `/settings`
- **Request-based** - users use `/settings` to view current arrangements and submit requests that are reviewed by System Admins

![Self-service proxy management on the Settings page](/images/proxy-self-service-settings.png)

**User-managed mode**

When proxy management is user-managed, there is no request queue. Users can create, edit, and cancel their own proxy arrangements from `/settings`, and can also remove arrangements where they are currently assigned as the proxy for someone else.

**Request-based mode**

When proxy management is request-based, users can still see their current arrangements in `/settings`, but only some changes require approval:

- **New assignments** - submitted as requests for System Admin approval
- **Edits to existing assignments** - submitted as requests for System Admin approval
- **Cancelling an assignment where someone is proxying the user** - allowed immediately without approval
- **Cancelling an assignment where the user is the proxy for someone else** - allowed immediately without approval

**Admin proxy management (Admin Panel)**

System Admins can always manage proxy assignments on behalf of any user, regardless of which mode is enabled. In request-based organisations, System Admins also review and action pending proxy requests.

- **Assignments** - search, filter, add, edit, and remove proxy assignments across the organisation
- **Requests** - review, approve, or reject requests for new assignments and edits when request-based mode is enabled

![Admin proxy management in the Admin Panel](/images/proxy-admin-assignments.png)

**Notifications**

Proxy management notifications are email-only and cannot be opted out of.

- When a new proxy arrangement is established, both the user and the proxy receive an email with the arrangement details
- When an existing proxy arrangement is edited, both the user and the proxy receive an email showing what changed
- When an existing proxy arrangement is cancelled, both the user and the proxy receive an email confirming the cancellation
- System Admins receive a daily summary email for pending proxy requests at 9am server time on Monday to Friday only, and only when there are pending requests to review

### Why this matters

Different organisations need different levels of control. Some want users to manage proxy arrangements directly, while others want approval in front of new access and changes. This update supports both models in a single product experience, gives System Admins full oversight, and keeps everyone informed when arrangements are created, changed, or cancelled.
