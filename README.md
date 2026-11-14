# Valentina Panic — Code Challenge Submission

A "Solutions for Freight Brokers" page for DAT, built with Next.js, React and TypeScript from the Figma design, `data/content.json` and `styles/tokens.css`. Design decisions, trade-offs and how AI was used are in [`SPEC.md`](SPEC.md).

## Prerequisites

- **Node.js 20.9 or newer** (the current LTS version is fine). Download it from [nodejs.org](https://nodejs.org) and run the installer. This also installs `npm`, which the steps below use.
- To check what you have, open a terminal and run `node -v`. It should print `v20.9.0` or higher.

## How to run locally

1. Download this repository: on GitHub, click **Code → Download ZIP** and unzip it, or clone it with `git clone`.
2. Open a terminal in the project folder (the one that contains `package.json`).
   - macOS: in Finder, right-click the folder and choose **New Terminal at Folder**.
   - Windows: open the folder in File Explorer, type `cmd` in the address bar and press Enter.
3. Install the dependencies (needed once; takes about a minute):
   ```
   npm install
   ```
4. Start the page:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.
6. To stop it, go back to the terminal and press `Ctrl + C`.

**Production build (optional):** this is how the page would be served for real, with optimized images and no development tools.
```
npm run build
npm start
```
Then open [http://localhost:3000](http://localhost:3000).

## How to run tests

There are no automated tests (see "Assumptions & trade-offs" in [`SPEC.md`](SPEC.md)). These checks must all pass with no warnings:

```
npm run lint        # code style and React/Next.js rules (ESLint)
npm run typecheck   # TypeScript, in strict mode
npm run build       # production build; the page must be listed as static (○)
```
