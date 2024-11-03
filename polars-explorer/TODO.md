## 1. Managing states across frontend and backend

We need to find out a way for Rust to keep the loaded LazyFrame as a persistent state

## 2. Designing communication protocols between frontend and backend for queries/responses

My plan is to never expose the full dataframe to the frontend; nor would the front end actually carry out any data
operation, including modifying views.
Instead, every data/view operation will be translated as a new query to be added to the current LazyFrame's execution
plan
The user could use a command to execute a query plan, prompting the frontend to send the plan to the backend
Then, the Rust backend will return a response to the frontend.
Every response should be paginated so that at any moment there will be a limited number of records on the display
This would ensure optimal performance, especially for huge datasets.

## Step by step plan

### 1. Reading a csv into a lazyframe

- [x] a. Printing the preview of the lazyframe on Rust backend (11/2/2024)

- [x] b. Print the lazyframe's JSON serialization on the Rust backend (11/3/2024)

- [x] c. Send the JSON to the frontend and display it in a div element (11/3/2024)
    - [x] i. Backend: Use Channel to send serde_json::Value
    - [x] ii. Frontend: Receive JSON using receiver.onmessage

- [x] d. Populate a data grid element using the received JSON (11/3/2024)
    - [x] i. Parse the incoming JSON
    - [x] ii. Display it in a table

### 2. App layout design

- [ ] a. Fix Data Table's horizontal scrolling

- [ ] b. Implement DataFrame selector panel

### 3. Paginated query
