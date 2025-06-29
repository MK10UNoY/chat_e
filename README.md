# Chat.E

A modern SvelteKit project. Follow these steps to run it locally using [pnpm](https://pnpm.io/).

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [pnpm](https://pnpm.io/) (v7 or newer)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MK10UNoY/chat_e.git
   cd chat_e
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Run the development server:**

   ```bash
   pnpm dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

## Building for Production

To create a production build:

```bash
pnpm build
```

To preview the production build locally:

```bash
pnpm preview
```

## Notes
- If you use environment variables, copy `.env.example` to `.env` and fill in your values (if applicable).
- For deployment, refer to [SvelteKit adapters](https://kit.svelte.dev/docs/adapters) for your target platform.
