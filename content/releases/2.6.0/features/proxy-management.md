---
title: "Proxy management"
summary: "Give administrators and end users direct control over proxy assignments — who can act on behalf of whom, and for how long — without requiring support tickets."
---

Give administrators and end users direct control over proxy assignments — who can act on behalf of whom, and for how long — without requiring developer intervention or support tickets.

> **Note:** The screenshots below are early mockups used to explore the design direction. The final implementation may look different and the feature set may be adjusted based on feedback and technical constraints.

### What's changing

**Self-service proxy requests (Settings page)**

End users can view their current proxy assignments, request new proxy access, update end dates, and remove assignments — all from the Settings page. Requests are submitted for admin review rather than applied immediately, keeping the approval workflow intact.

![Self-service proxy management on the Settings page](/images/proxy-self-service-settings.png)

**Admin proxy management (Admin Panel)**

Administrators get a dedicated User Proxy Management tab in the Admin Panel with full visibility across all proxy assignments. The view is split into two sub-tabs:

- **Assignments** — search, filter, add, edit, and remove proxy assignments across the organisation
- **Requests** — review, approve, or reject self-service proxy requests submitted by users, with a pending count badge for quick triage

![Admin proxy management in the Admin Panel](/images/proxy-admin-assignments.png)

### Why this matters

Today, proxy changes require a support ticket or direct database intervention. This feature closes that gap by giving both sides of the workflow — the person requesting access and the administrator granting it — purpose-built interfaces inside Brief Connect.
