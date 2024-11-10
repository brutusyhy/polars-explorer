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

To run this app in dev mode, first `cd polars-explorer`. Then, run `pnpm install` to install dependencies.

After that, run `pnpm tauri dev`. It utilizes vite to monitor real-time changes to code, and recompile Rust/hot reload
React
code accordingly.

## Functionalities

As this project is still at an early stage, it has only implemented a small portion of the designed functionalities.
These include:

### Data Import

1. Load (relatively) well-formatted csv files into a Frame

### Frame/View Management

1. Keep multiple Frames in memory, where each Frame can have multiple Views
2. Freely switch between Frames and Views, where each view stores its reading progress
3. Delete non-base Views and loaded Frames
4. Rename Views and Frames
5. Turn non-base Views into standalone Frames

### Data Exploration/Manipulation

1. A paginated Data Explorer tool
2. A info panel Displaying View's shape and column information
3. Create new Views by selecting columns
4. Provide description of the Polars query plan

### Data Export

1. Export any View into a csv file

## Test CSV

/src-tauri/test-csv-generator is a tool that can generate different kinds of testing csv to check how well the app can
handle them

The scope of testing will be expanded in the future.