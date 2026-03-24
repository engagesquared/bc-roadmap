---
title: "Notification Record"
summary: "Limit notifications to only those who have access to a record."
---

# Notification Record Feature PRD

## Context

Brief Connect's workflow system is powerful and enables a number of use cases, such as dedicated stages for drafting before sending on documents to be developed. In most cases, users gain access to a record when being assigned a role and get a notification when they are assigned. This works well for the majority of circumstances, but some of our customers have identified a need to collaboratively prepare records - including assigning roles - but without triggering any notifications.

## Problem Statement & Goal

Users shouldn't receive a notification if they don't have access to a record.

We will ensure a notification is only ever received by users who have access. We'll achieve this by evaluating recipients for a given notification, and removing any recipients who wouldn't have access to view the record if we sent them a link.

## Key Use Cases

The primary use case behind this change is to enable workflow configurations - like dedicated draft stages - that allow groups of users to collaborate on record preparation without alerting role assignees until the appropriate time.

## Value Proposition

- Prevent user confusion from receiving notifications about records they cannot access
- Enable collaborative draft preparation workflows
- Improve notification relevance and reduce noise
- Support flexible workflow configurations with draft stages

## Capabilities

- Permission evaluation for all notification recipients
- Automatic filtering of recipients without record access
- Support for draft stage collaboration without premature notifications
- Consistent behavior across email and Teams notifications

## Success Criteria

- 100% of notifications only sent to users with record access
- Zero instances of users receiving notifications for inaccessible records
- Support for dedicated draft stage workflows
- Seamless integration with existing notification system
