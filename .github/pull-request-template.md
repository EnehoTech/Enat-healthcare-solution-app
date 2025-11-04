## Description
This is where you provide the purpose of the pull request and necessary background/context. This can be something technical. What specific steps will be taken to achieve the goal? This should include details on service integration, job logic, implementation, etc.

## Changes Made

**Codebase Changes:**
List the key files/components changed and what they now do. Focus on the engineering side of your solution.

- [x] Features Added: (e.g., Patient demographics persistence, automated appointment check-in portal.)
- [x] Bug Fixes: (e.g., Fixed EMR entry error when saving diagnosis codes.)
- [x] Refactoring: (e.g., Separated Appointment service logic from Patient service.)
- [x] Security/Compliance: (e.g., Added input validation to prevent XSS in patient notes.)

**Outside of Codebase Changes:**
if you've made changes that affect deployment or integration, list them here.

- [x] Infrastructure/Configuration: (e.g., Updated AWS Lambda permissions, added a new environment variable SMS_API_KEY.)
- [x] External APIs/Services: (e.g., Configured new endpoint for external Billing API, updated database connection string.)
- [x] Documentation: (e.g., Updated API_Docs.md with new patient endpoint details.)

## Related Issues

Reference any related project management tickets or issues addressed by this PR.

- [x] GitHub Issue Reference: (e.g., #123 - Implement Patient Portal Status Check)
- [x] Jira Ticket: (e.g., ENAT-456 - Fix broken PDF receipt generation)
- [x] Related Epic/Feature: (If applicable)

## Screenshots (if applicable)

Include screenshots or GIFs that demonstrate the changes visually, if relevant. For example, if the change is UI-related, screenshots are relevant.

## Testing Instructions

Please provide step-by-step instructions for testing the changes, including any setup or configuration required. Provide instructions so we can reproduce. 
Please also list any relevant details for your test configuration.

## Quality Checklist

Please make sure to review and check the following before submitting your pull request: Remove any items that are not applicable.

- [] Code changes have been thoroughly reviewed
- [] Code follows the project's coding standards and style guidelines
- [] All commit messages are clear and descriptive
- [] Hard-to-understand areas have been commented in the code
- [] Unit tests have been added/updated 
- [] Documentation has been updated to reflect the changes (if applicable)
- [] All tests pass locally
- [] The PR has been reviewed for potential security vulnerabilities, such as SQL injection or XSS attacks
- [] Any external dependencies have been updated (if applicable)

## Additional Notes

Here, you provide any additional information that might be useful to the reviewer in evaluating this pull request. This could include performance and security considerations, design choices, known limitations, dependencies, planned future enhancements, compatibility (like backward compatibility with APIs, libraries), etc.
