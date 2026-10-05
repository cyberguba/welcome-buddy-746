# Engineering Standards & Development Guidelines

## Purpose

This document defines the mandatory engineering standards, architecture principles, coding conventions, and quality requirements that must be followed when generating, modifying, or reviewing code.

The primary goals are:

- Maintainability
- Readability
- Scalability
- Security
- Testability
- Performance
- Consistency

All generated code must adhere to these guidelines.

---

# Core Principles

## 1. Clean Code

Code should be written for humans first and computers second.

### Requirements

- Use meaningful names.
- Avoid abbreviations unless universally understood.
- Functions should express intent clearly.
- Keep code self-documenting.
- Prefer clarity over cleverness.

### Good

- `calculateInvoiceTotal()`
- `isUserAuthorized()`
- `getCustomerOrders()`

### Bad

- `calc()`
- `auth()`
- `doStuff()`

---

## 2. DRY (Don't Repeat Yourself)

Avoid duplicating business logic.

### Requirements

- Extract repeated logic into reusable functions.
- Centralize validations.
- Centralize shared constants.
- Reuse components where appropriate.

### Rule

If logic appears more than once, evaluate abstraction.

---

## 3. KISS (Keep It Simple)

Prefer the simplest solution that satisfies requirements.

### Requirements

- Avoid unnecessary abstractions.
- Avoid premature optimization.
- Avoid over-engineering.
- Avoid excessive nesting.

---

## 4. YAGNI (You Aren't Gonna Need It)

Do not implement functionality before it is needed.

### Requirements

- Build only what is required.
- Do not add speculative features.
- Avoid future-proofing without justification.

---

## 5. SOLID Principles

### S - Single Responsibility Principle

A class, module, or function should have one reason to change.

### O - Open/Closed Principle

Software should be open for extension but closed for modification.

### L - Liskov Substitution Principle

Derived implementations should be interchangeable with their base types.

### I - Interface Segregation Principle

Consumers should not depend on methods they do not use.

### D - Dependency Inversion Principle

Depend on abstractions, not concrete implementations.

---

# Code Structure

## Project Organization

Code must be organized by feature/domain rather than by technical type whenever practical.

Example:

```text
src/
├── features/
│   ├── users/
│   ├── products/
│   ├── orders/
│   └── billing/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   └── types/
│
├── infrastructure/
│
└── tests/
```

---

# Function Standards

## Functions Must

- Have a clear purpose.
- Do one thing well.
- Be small and focused.
- Be easy to test.
- Avoid hidden side effects.

### Preferred

```ts
function calculateTax(amount: number): number
```

### Avoid

```ts
function processEverything()
```

---

# Naming Conventions

## Variables

Use descriptive names.

```ts
customerId
invoiceAmount
isAuthenticated
```

Avoid:

```ts
x
tmp
data
obj
```

unless context is extremely obvious.

---

## Functions

Functions should start with a verb.

Examples:

```ts
getUser()
createOrder()
updateProfile()
deleteProduct()
validateInput()
```

---

## Booleans

Use prefixes:

```ts
is
has
can
should
```

Examples:

```ts
isLoading
hasPermission
canEdit
shouldRetry
```

---

## Constants

Use:

```ts
UPPER_SNAKE_CASE
```

Example:

```ts
MAX_RETRY_ATTEMPTS
DEFAULT_PAGE_SIZE
```

---

# Error Handling

## Requirements

Never silently ignore errors.

Use:

- Structured logging
- Error boundaries
- Explicit try/catch blocks where needed
- Meaningful error messages

### Avoid

```ts
catch (e) {}
```

### Preferred

```ts
catch (error) {
  logger.error("Failed to fetch user", error)
}
```

---

# Security Requirements

## Input Validation

All external input must be validated.

Sources include:

- Forms
- APIs
- Query parameters
- Request bodies
- File uploads
- Webhooks

---

## Secrets Management

Never hardcode:

- API keys
- Access tokens
- Passwords
- Secrets

Use:

- Environment variables
- Secret managers
- Secure vaults

---

## Authorization

Always enforce authorization server-side.

Never rely solely on client-side permissions.

---

## Data Protection

- Follow least privilege principle.
- Protect sensitive information.
- Avoid exposing internal implementation details.
- Mask confidential data in logs.

---

# Performance Standards

## Requirements

Optimize only after identifying bottlenecks.

### Prefer

- Pagination
- Memoization where useful
- Lazy loading
- Efficient querying
- Proper indexing

### Avoid

- Premature optimization
- Excessive caching
- Unnecessary rerenders
- N+1 queries

---

# Database Guidelines

## Requirements

- Use transactions where appropriate.
- Validate data before persistence.
- Avoid duplicated records.
- Define clear relationships.
- Use indexes intentionally.

### Avoid

```sql
SELECT *
```

when specific fields are sufficient.

---

# API Standards

## REST APIs

### Requirements

- Consistent naming
- Proper HTTP methods
- Proper status codes
- Predictable responses

Examples:

```http
GET /users
GET /users/:id
POST /users
PUT /users/:id
DELETE /users/:id
```

---

## Response Structure

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

Use consistent response formats across the entire application.

---

# Frontend Standards

## Components

Components must:

- Have a single responsibility
- Be reusable
- Remain small where practical
- Avoid excessive prop drilling

---

## State Management

Prefer:

1. Local state
2. Context
3. Global state

Introduce global state only when justified.

---

## Accessibility

Mandatory requirements:

- Semantic HTML
- Keyboard navigation
- Proper labels
- ARIA only where necessary
- Sufficient color contrast

---

# Testing Requirements

## Mandatory Coverage

Every feature should include:

- Unit tests
- Integration tests where appropriate
- Critical path coverage

---

## Test Quality

Tests should verify:

- Expected behavior
- Edge cases
- Failure conditions
- Validation rules

Avoid tests that merely increase coverage percentage.

---

# Code Review Checklist

Before completing any implementation, verify:

- [ ] Code is readable.
- [ ] No duplicated logic exists.
- [ ] Naming is meaningful.
- [ ] Functions have single responsibility.
- [ ] Errors are handled properly.
- [ ] Sensitive data is protected.
- [ ] Security concerns are addressed.
- [ ] Tests are included.
- [ ] Types are properly defined.
- [ ] No dead code exists.
- [ ] No unnecessary complexity exists.
- [ ] Documentation is updated.

---

# Documentation Standards

Every significant module should contain:

## Purpose

What it does.

## Responsibilities

What it owns.

## Dependencies

What it relies on.

## Constraints

Important implementation limitations.

---

# AI Code Generation Rules

When generating code:

1. Prioritize readability over brevity.
2. Follow Clean Code principles.
3. Follow SOLID principles when justified.
4. Avoid unnecessary abstractions.
5. Avoid duplicate logic.
6. Include error handling.
7. Include appropriate typing.
8. Consider security implications.
9. Consider performance implications.
10. Generate production-ready code.
11. Never generate placeholder implementations unless explicitly requested.
12. Explain architectural decisions when non-trivial.
13. Keep files reasonably sized.
14. Prefer composition over inheritance.
15. Prefer explicitness over magic behavior.
16. Follow existing project conventions first.
17. Maintain consistency with surrounding code.

---

# Definition of Done

A task is considered complete only if:

- Requirements are fully implemented.
- Code follows all standards in this document.
- Tests pass.
- No significant linting issues remain.
- No duplicated logic exists.
- Security considerations have been addressed.
- Documentation is updated if required.
- The solution is maintainable by another developer without additional explanation.
