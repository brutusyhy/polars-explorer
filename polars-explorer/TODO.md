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