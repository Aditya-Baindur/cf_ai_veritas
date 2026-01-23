# [Chat.sh](./chat.sh) :

is a simple helpful script which can be used to quickly access aliases. To use it, you can do `source chat.sh`

| Shortcut | Purpose          | Explanation                  |
| -------- | ---------------- | ---------------------------- |
| f        | format           | Runs Prettier                |
| d        | wrangler deploy  | Deploys the Ai-worker        |
| o        | open ${base_url} | Opens the base URL           |
| t        | wrangler tail    | Shows the logs of the worker |
| fd       | format & deploy  | Runs Prettier and Deploys    |

# **[Package.json](./package.json)** :

Main entry point of the project, you can use it by running `npm run <shortcut>` or `pnpm <shortcut>` from the root of the project.

| Shortcut | Purpose               | Explanation                            |
| -------- | --------------------- | -------------------------------------- |
| i-all    | install all           | Installs all deps for the entire repo  |
| backend  | ai-worker npm run dev | Runs the backend locally               |
| frontend | frontend run dev      | Runs the frontend locally              |
| format   | Prettier              | Formats the entire repo using Prettier |
| tail     | wrangler tail         | Shows the logs of the worker           |
