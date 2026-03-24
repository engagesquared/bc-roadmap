export interface Feature {
  id: string;
  title: string;
  description: string; // Brief description for list view
  content: string; // Markdown content
}

export interface Release {
  id: string;
  version: string;
  theme: string;
  description: string; // Markdown content
  estimatedDate: Date;
  features: Feature[];
}

export const roadmapData: Release[] = [
  {
    id: "release-2.6",
    version: "2.6",
    theme: "Group Role Assignment",
    description: `## Group Role Assignment

A new way to assign workflow tasks to a group instead of user(s) - aligning how departmental teams collaborate together and assign work.

### Key Benefits
- End users are already familiar with the concept of assigning tasks to groups instead of specific users
- Ensures the transition to Brief Connect is seamless
- Fewer issues with allocation when wrong individual is allocated
- Less instances of record workflows being 'stuck' when individual assigned role cannot perform task

**Impact**: Streamlines team collaboration and eliminates the cumbersome 'proxy group' workaround.`,
    estimatedDate: new Date("2026-03-15"),
    features: [
      {
        id: "feature-group-roles",
        title: "Group Role Assignment",
        description: "Assign workflow tasks to groups instead of specific users.",
        content: `# Group Role Assignment Feature PRD

## Context

Our end-users often sit in teams which administer certain functions within a department. For example, our 'power users' might be individuals in a Cabinet Services team, or a Ministerial and Parliament team. The exact makeup and structure of these teams differs with each department - but they all exist to help oversee departmental processes like:

- Responding to Ministerial requests for briefings
- Following standard processes and expectations to develop and provide Cabinet Submissions
- Meeting Parliamentary obligations for providing responses to Questions on Notice

As part of their oversight process, these teams need to allocate other teams of staff (typically referred to as 'programme areas) to lead the response to a brief, develop a response to correspondence etc.

When allocating to another team, it's not always apparent who from those teams should perform the assigned task.

## Problem Statement & Goal

When allocating to another team, it's not always apparent who from those teams should perform the assigned task. The existing 'proxy group' workaround can be cumbersome and involves creating new, licensed user accounts for each group.

Our goal is to provide an easier way for groups to used and integrated into workflows, roles, and task assignments.

## Value Proposition

- End users are already familiar with the concept of assigning tasks to groups instead of specific users. Ensures the transition to Brief Connect is seamless
- Fewer issues with allocation when wrong individual is allocated
- Less instances of record workflows being 'stuck' when individual assigned role cannot perform task

## Capabilities

- Configure core modules in-app through guided UI, centralised into single location
- Support multiple configurations, swap between them for different use cases
- Support for configuration export and import

## Success Criteria

- Eliminate need for 'proxy group' workaround
- Reduce workflow stuck instances by 40%
- Improve task allocation accuracy
- Seamless integration with existing departmental team structures`
      }
    ]
  },
  {
    id: "release-2.7",
    version: "2.7",
    theme: "Enriched Search",
    description: `## Enriched Search

Unlock powerful content and semantic search so staff can surface the right brief in seconds.

### Key Benefits
- **Save minutes, not moments** – executives locate the correct document in seconds rather than trawling channels or emailing colleagues
- **Reduce risk** – find the most up‑to‑date brief first time, lowering the chance of referencing outdated advice
- **Drive reuse** – easier discovery encourages teams to build on prior work instead of reinventing it
- **Lay AI foundations** – creates the index that future generative agents can use

**Impact**: Transform how staff discover and reuse institutional knowledge across briefs, submissions, and correspondence.`,
    estimatedDate: new Date("2026-05-20"),
    features: [
      {
        id: "feature-enriched-search",
        title: "Enriched Search",
        description: "Unlock powerful content and semantic search.",
        content: `# Enriched Search Feature PRD

## Context

Brief authors, reviewers, and executives routinely mine past briefs — citing them as evidence in new submissions, drafting responses to ministerial questions and correspondence, and satisfying Freedom of Information obligations — so quick, reliable search is essential. 

Today's Brief Connect search only scans titles and metadata, forcing users to remember exact document names or dig through folders. As content grows, so does the time wasted hunting for the right brief. 

Additionally, the existing Brief Connect search system only reindexes record changes approximately every ~30mins. This delay can cause the dashboard to appear out of date in circumstances where records are updated frequently.

## Problem Statement & Goal

Searching for something "housing affordability" should pull every relevant brief—regardless of whether those words appear in the title, body, or attachment. Currently it does not. 

Our goal is to:
- Expose full‑text and AI‑driven semantic search, enabling natural language queries like "Briefs relating to social housing in 2023," while respecting existing permissions
- Ensure that Brief Connect serves up fresher search and dashboard results

## Value Proposition

- **Save minutes, not moments** – executives locate the correct document in seconds rather than trawling channels or emailing colleagues
- **Reduce risk** – find the most up‑to‑date brief first time, lowering the chance of referencing outdated advice
- **Drive reuse** – easier discovery encourages teams to build on prior work instead of reinventing it
- **Lay AI foundations** – creates the index that future generative agents can use

## Capabilities

### Content Search
- Index full text of briefs, attachments (Word, PDF, email) and comments
- Relevance‑ranked results with hit‑highlighting
- Security trimming inherited from record permissions

### Semantic (AI) Search
- Natural‑language queries using semantic ranking/embeddings to return relevant data
- Handles synonyms and related terms (e.g. "TIQ" ↔ "Trade & Investment QLD")
- Inline filters: "Briefs about cyber security approved last quarter"

## Success Criteria

- Full-text indexing across all document types
- Real-time or near-real-time reindexing (eliminating 30-minute delay)
- Natural language query support with high relevance
- Sub-second search response times
- Permission-aware search results`
      }
    ]
  },
  {
    id: "release-2.8",
    version: "2.8",
    theme: "Digital Signatures for Decisions and Approvals",
    description: `## Digital Signatures for Decisions and Approvals

Capture signatures inside Brief Connect — no printing, no scanning, full audit trail.

### Key Benefits
- **End‑to‑end digital** – eliminate the print‑sign‑scan loop; speed up approvals
- **Native signing experience** – users can add a handwritten‑style signature without leaving Brief Connect
- **Single source of truth** – signed PDF stored alongside the brief, governed by existing permissions
- **Confidence & trust** – executives can rely on decisions when facing FOI, audits, or media enquiries

**Impact**: Modernize approval workflows and eliminate manual signature collection processes.`,
    estimatedDate: new Date("2026-07-30"),
    features: [
      {
        id: "feature-digital-signatures",
        title: "Digital Signatures for Decisions and Approvals",
        description: "Capture signatures inside Brief Connect.",
        content: `# Digital Signatures for Decisions and Approvals Feature PRD

## Context

Many departments and DLOs still print or email briefs to collect handwritten or image‑based signatures. This slows turnaround, introduces version confusion, and falls short of modern expectations.

## Problem Statement & Goal

Brief Connect currently records an approver's decision as a special workflow status change. If the brief documents require signature, it's primarily and off-system process.

Our goal is to let authors request and capture a compliant digital signature within the same interface, preserving a record of who approved what, when, and under which role.

## Value Proposition

- **End‑to‑end digital** – eliminate the print‑sign‑scan loop; speed up approvals
- **Native signing experience** – users can add a handwritten‑style signature without leaving Brief Connect
- **Single source of truth** – signed PDF stored alongside the brief, governed by existing permissions
- **Confidence & trust** – executives can rely on decisions when facing FOI, audits, or media enquiries

## Capabilities

### Signature Request Workflow Configuration
Specify which workflow tasks require a digital signature before proceeding

### In-app signature experience
Built‑in signature canvas captures a handwriting‑style mark right in the browser

### Apply signature to final documents
Map signature requests to briefing document signature blocks, insert signatures into final doc

## Success Criteria

- Eliminate print-sign-scan workflow
- 100% digital signature capture for approvals
- Full audit trail of signature events
- Compliant signature storage and retrieval
- Seamless integration with existing workflow status changes`
      }
    ]
  },
  {
    id: "release-2.9",
    version: "2.9",
    theme: "Notification Record",
    description: `## Notification Record

Limit notifications to only those who have access to a record.

### Key Benefits
- Users only receive notifications for records they can actually view
- Enables collaborative preparation without premature alerts
- Supports dedicated draft stages for team collaboration
- Prevents confusion from receiving notifications about inaccessible records

**Impact**: Ensure email and Teams feed notifications are only ever sent to those who have access to view the relevant record.`,
    estimatedDate: new Date("2026-10-15"),
    features: [
      {
        id: "feature-notification-permissions",
        title: "Notification Record",
        description: "Limit notifications to only those who have access to a record.",
        content: `# Notification Record Feature PRD

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
- Seamless integration with existing notification system`
      }
    ]
  },
  {
    id: "release-3.0",
    version: "3.0",
    theme: "Enterprise Platform",
    description: `## Enterprise Platform

Enterprise-grade features for large organizations including advanced security, compliance, and administration.

### Major Additions
- SSO and SAML support
- Advanced permissions and roles
- Audit logging
- Compliance certifications (SOC 2, GDPR, HIPAA)

This release opens up the enterprise market segment.`,
    estimatedDate: new Date("2026-12-20"),
    features: [
      {
        id: "feature-sso",
        title: "Single Sign-On (SSO)",
        description: "Support SAML 2.0 and OAuth 2.0 SSO with major identity providers.",
        content: `# Single Sign-On Feature PRD

## Context
Enterprise customers require SSO integration with their identity providers for security and user management.

## Goal
Support SAML 2.0 and OAuth 2.0 SSO with major identity providers (Okta, Azure AD, Google Workspace).

## What We're Solving
- **Problem**: Enterprise customers can't adopt without SSO
- **Solution**: Full SSO support with auto-provisioning
- **Metrics**: Enable 50+ enterprise deals worth $5M+ ARR

## Technical Requirements
- SAML 2.0 implementation
- OAuth 2.0 / OIDC support
- JIT (Just-In-Time) provisioning
- SCIM for user sync
- Role mapping

## Success Criteria
- Support top 5 identity providers
- Sub-second authentication
- 99.99% authentication availability`
      },
      {
        id: "feature-audit-logs",
        title: "Comprehensive Audit Logging",
        description: "Implement tamper-proof audit logging for all user actions and system events.",
        content: `# Comprehensive Audit Logging PRD

## Context
Enterprise customers need detailed audit trails for compliance, security, and operational insights.

## Goal
Implement tamper-proof audit logging for all user actions and system events with enterprise-grade retention and export capabilities.

## What We're Solving
- **Problem**: No visibility into who did what and when
- **Solution**: Complete audit trail with search and export
- **Metrics**: Meet SOC 2 and compliance requirements

## Features
- Log all user actions
- System event tracking
- Tamper-proof storage
- Advanced search and filtering
- Export to SIEM systems
- Retention policies
- Real-time alerting

## Success Criteria
- 100% action coverage
- Sub-second log ingestion
- 7-year retention support
- SOC 2 compliance achieved`
      }
    ]
  }
];