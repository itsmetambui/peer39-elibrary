This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Deploy on Vercel

This project is deployed on Vercel, you can visit it with this [link](https://peer39-elibrary.vercel.app/).

## Dependencies
- [MSW](https://mswjs.io/) - Mock service worker for the mock Backend APIs (in this project case, the real Backend).
- [Tailwindcss](https://tailwindcss.com/) - A utility-first CSS framework.
- [shadcnui](https://ui.shadcn.com/) - Accessible/customizable UI components.
- [react-hook-form](https://www.react-hook-form.com/) - Form validation.
- [zod](https://zod.dev/) - TypeScript-first schema validation with static type inference.
- [Playwright](https://playwright.dev/) - e2e testing framework.

## Project structure

```bash
📦peer39-elibrary
 ┣ 📂src
 ┃ ┣ 📂apis
 ┃ ┣ 📂app
 ┃ ┃ ┣ 📂authors
 ┃ ┃ ┃ ┣ 📂add
 ┃ ┃ ┃ ┣ 📂edit
 ┃ ┃ ┃ ┃ ┗ 📂[id]
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂books
 ┃ ┃ ┃ ┣ 📂add
 ┃ ┃ ┃ ┣ 📂edit
 ┃ ┃ ┃ ┃ ┗ 📂[id]
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┗ 📜page.tsx
 ┃ ┣ 📂components
 ┃ ┣ 📂hooks
 ┃ ┣ 📂lib
 ┃ ┣ 📂mocks
 ┃ ┗ 📂types
 ┣ 📂tests
```

## Getting Started

Clone the repo locally, and run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Improvements and considerations
The following are the further improvements suggested as they are outside of the project scope requirements, and consideration for alternative technical choices.

- Zod is used instead of Yup for simple copy/paste sake since other dependencies in this project is using Zod. A switch would be easily achievable if needed.
- For this kind of CMS type of application, a `SSR/SSG` solution would be better. But since there’s no Backend, `CSR` is the only choice.
- Pagination is currently performed only on the Frontend after loading all the records from the mock BE, it should be done in the Backend.
- Pagination should be synced to url (i.e `?pageSize=5&page=2`).
- The author pickers and autocomplete could be improved with [infinite queries](https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries) and [virtualization](https://tanstack.com/virtual/latest) in case the author list becomes too long.
- Use `slug` for url params instead of `id`.
