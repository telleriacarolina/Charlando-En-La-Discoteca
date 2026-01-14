
# The Chatroom

This repository contains the source code for The Chatroom, which powers the chatrooms for Charlando En La Discotec.

## Project Structure

- Source code: see `api/`, `socket/`, `web/`, `shared/`, and `packages/` folders
- Documentation, guides, and reference: see `docs/`, `guides/`, `reference/`, and `info/`
- Scripts and utilities: see `scripts/`
- Legacy and old files: see `legacy/`, `old_docs/`, `old_guides/`, `old_info/`, `old_scripts/`
- External and integration info: see `external/`, `info/`

For full documentation, guides, and technical details, see the `docs/` folder and its `INDEX.md`.

---

## Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables (see `.env.example` and `docs/`)
3. Set up the database:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. Run the servers:

   ```bash
   npm run dev
   # or run each service individually
   npm run dev:api
   npm run dev:socket
   npm run dev:web
   ```

5. Access the app at http://localhost:3000

---

## More Information

- See `docs/INDEX.md` for a categorized list of documentation and guides
- See `guides/` for onboarding and how-tos
- See `reference/` for schemas and technical standards
- See `info/` for integration notes and external references

---

## License

MIT License. See [LICENSE](LICENSE) for details.
