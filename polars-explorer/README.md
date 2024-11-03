# Polars Explorer

## Introduction

Polars Explorer aims to provide a lightweight GUI to data exploration/manipulation tasks using Rust Polars.

It is based on Tauri, which provides a lightweight webView to display the React frontend, and allows easy communication
between the React frontend and the Rust backend.

This project aims to distinguish itself from other data exploration applications by relegating as much data manipulation
operations to the highly performant Rust backend.

Through a combination of backend-provided paginated query, Polars-based lazy query evaluation and optimization, and
limiting unnecessary data copying and manipulation on the front end, it hopes to provide a very performant data explorer
that's capable of handling very large datasets.

Right now, this project is largely at its inception, and any feedback/advice/help would be greatly appreciated!

## Build

This project is scaffolded using `pnpm create tauri-app` with React and TypeScript.

To run this app in dev mode, run `pnpm install` to install dependencies.

Then, run `pnpm tauri dev`. It utilizes vite to monitor real-time changes to code, and recompile Rust/hot reload React
code accordingly.
