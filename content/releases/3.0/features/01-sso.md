---
title: "Single Sign-On (SSO)"
summary: "Support SAML 2.0 and OAuth 2.0 SSO with major identity providers."
---

# Single Sign-On Feature PRD

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
- 99.99% authentication availability
