# 🧪 Assignment — Class Enrollment API (Instructions Only)

> **Goal:** Build a backend API using **Express**, **MongoDB**, and **middleware** by following the steps below.
>
> ⚠️ This assignment is **instruction-only**. You must write the code yourself.

---

## 📌 Scenario

You are building a **Class Enrollment backend API**.

The system tracks:

* students
* courses
* enrollment records

Data alrea dy exists in MongoDB. Your job is to **connect to it, expose it via routes, and add middleware**.

---

## Part 1 — Project Setup

1. Initialize a new Node.js project
npm init -y

2. Install required packages:

   * `express`
   * `mongoose`
npm install express mongoose

3. Set up a basic Express server

import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));




4. Ensure the server starts without errors

---

## Part 2 — MongoDB (Import Data First)

You are provided with a JSON file containing enrollment data.

Your tasks:

1. Start MongoDB
2. Import the provided JSON file into a database called **`schoolDB`**
3. Verify that a collection named **`enrollments`** exists
4. Confirm that documents are visible using MongoDB Compass or shell

mongoimport --db schoolDB --collection enrollments --file class_enrollments.json --jsonArray


You should **not** modify the data structure.

---

## Part 3 — Mongoose Model (Add This First)

Before writing routes, you will now introduce **one Mongoose model**.

> This helps structure data access and prepares you for more complex applications later.

### Your tasks

1. Create a `models` folder
2. Create a file for the enrollment model
3. Define a schema that represents an enrollment record

The model **must include** at least:

* student name
* course name
* enrollment status
* enrollment date

```
import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true
  },

  courseName: {
    type: String,
    required: true,
    trim: true
  },

  status: {
    type: String,
    default: "enrolled"
  },

  enrolledAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Enrollment", enrollmentSchema);

```

---

## Part 4 — Express Routes Using the Model

Once the model is created, build routes that use it.

### Required Routes

You must implement:

* `GET /enrollments`

  * Fetch all enrollment records from MongoDB

* `GET /enrollments/:id`

  * Fetch a single enrollment by ID
  * Return an error if not found

All database access must:

* use the Mongoose model
* use `async/await`

---

## Part 5 — Middleware

Once routes are working, add middleware.

### 1️⃣ Custom Logger Middleware

* Logs the HTTP method and URL for every request
* Must call `next()`

### 2️⃣ Error-Handling Middleware

* Catches all errors passed using `next(err)`
* Sends a JSON response
* Uses appropriate HTTP status codes

> Reminder: Error middleware must be added **after** routes.

---

##  Part 6 — Error Scenarios to Handle

Your API must correctly handle:

1. Requesting an enrollment ID that does not exist
2. Invalid enrollment ID format
3. Database or connection errors

Errors must:

* NOT crash the server
* Return JSON (not HTML)

---

## 🧠 Reflection Questions (Answer in README)

1. Why do database operations require `async/await`?
2. What happens if you forget to call `next(err)`?
3. Why is error middleware placed at the end?

---

> **Important:** This assignment is about understanding **flow**, not copying code.
> If something breaks, debug it — do not skip it.


1. create a MongoDB database (catalog name is always plural and model names are singular)

2. upload json

3. Create a model folder and then copy model files and copy and paste in the data

4. Inside the routes folder, call it enrollment.js (copy things from notes.js)
  -call the model


Why do database operations require async/await?
Database operations involve asynchronous work like network and disk I/O, so async/await allows the code to pause until the operation completes or fails, ensuring later logic runs with the correct result instead of continuing too early.

What happens if you forget to call next(err)?
If you forget to call next(err) (or throw the error), Express will not pass the error to the error-handling middleware, which can cause the request to hang or return an incorrect response because the error is never handled.

Why is error middleware placed at the end?
Error middleware is placed at the end because Express only forwards errors to middleware that comes after the route where the error occurred, so placing it last ensures it can catch errors from all routes and middleware.