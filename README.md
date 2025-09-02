
# Student Grade System

A simple web application to manage student records, including their marks, percentage, and file uploads. Built with **React**, **Node.js**, **Express**, and **MongoDB**.

## Features

- Display list of students with pagination
- Add, edit, and delete student records
- Upload files (e.g., student documents)
- Responsive UI
- CORS enabled for development and deployment

## Technologies Used

- **Frontend:** React, Axios, CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas)
- **Other:** dotenv, cors

## Setup & Installation

### Backend

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file:

```
PORT=5000
MONGO_URI=<your_mongodb_uri>
CORS_ORIGIN=http://localhost:3000
```

3. Start the server:

```bash
npm start
```

### Frontend

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file:

```
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the frontend:

```bash
npm start
```

## API Endpoints

- `GET /api/students?page=1&limit=25` - List students
- `POST /api/students` - Add a student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `POST /api/uploads` - Upload files

## Notes

- Make sure backend is running before starting the frontend.
- CORS is configured to allow requests from `http://localhost:3000`.
- Pagination is implemented on the frontend.


