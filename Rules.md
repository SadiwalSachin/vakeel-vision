Work incrementally on the Vakeel Vision frontend.

Architecture:
- Next.js App Router and TypeScript
- Tailwind CSS and shadcn/ui
- TanStack Query for server state
- React Hook Form and Zod for form validation
- A feature-based structure with a shared API client and feature-specific services and hooks
- Light, dark, and system themes

Rules:
1. Work only on the milestone I explicitly request.
2. Before editing, inspect the relevant existing files and summarize the proposed changes.
3. Do not rewrite unrelated files or restructure the entire project.
4. Reuse existing components and established conventions.
5. Keep API calls out of UI components; use feature API services and TanStack Query hooks.
6. Use the existing FastAPI OpenAPI specification as the source of truth for endpoints and schemas.
7. Do not invent API endpoints or fabricate server data.
8. Include loading, error, empty, success, and validation states where relevant.
9. Preserve accessibility, responsive design, and light/dark theme support.
10. After implementing, list the files changed and provide the verification commands or manual checks.
11. Stop after completing the requested milestone and wait for my approval before continuing.
12. Pages should not make Axios requests directly.
13. Every API operation belongs in a service file.
14. TanStack Query hooks call service functions.
15. Every backend endpoint path belongs in api-routes.ts.
16. Use Zod for form validation and the backend for authoritative validation.
17. Use shared UI components rather than recreating buttons, dialogs, and inputs.
Don't create services or hooks for backend endpoints that don't exist

