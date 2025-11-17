# Library Management API Documentation

## Base URL
- Local: `http://localhost:3000`
- Production: `https://cse341-project2-1-fa5z.onrender.com/`

## Overview
This API manages a library system with books and authors. It supports full CRUD operations with validation and error handling.

---

## Collections

### Books Collection
Contains 8 fields:
- `_id`: ObjectId (auto-generated)
- `title`: String (required)
- `author`: String (required)
- `isbn`: String (required)
- `publishedYear`: Number (required)
- `genre`: String (required)
- `pages`: Number (required)
- `language`: String (required)
- `available`: Boolean (default: true)
- `createdAt`: Date (auto-generated)

### Authors Collection
Contains 6 fields:
- `_id`: ObjectId (auto-generated)
- `firstName`: String (required)
- `lastName`: String (required)
- `birthYear`: Number (required)
- `nationality`: String (required)
- `biography`: String (required)
- `createdAt`: Date (auto-generated)

---

## Books Endpoints

### 1. Get All Books
**GET** `/api/books`

**Description:** Retrieve all books from the database.

**Response:**
- Status: `200 OK`
- Body: Array of book objects

**Example Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "isbn": "978-0-06-112008-4",
    "publishedYear": 1960,
    "genre": "Fiction",
    "pages": 324,
    "language": "English",
    "available": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### 2. Get Book by ID
**GET** `/api/books/:id`

**Description:** Retrieve a single book by its ID.

**Parameters:**
- `id` (path parameter): MongoDB ObjectId

**Response:**
- Status: `200 OK` if found
- Status: `404 Not Found` if book doesn't exist
- Status: `400 Bad Request` if ID format is invalid

**Example Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "To Kill a Mockingbird",
  "author": "Harper Lee",
  "isbn": "978-0-06-112008-4",
  "publishedYear": 1960,
  "genre": "Fiction",
  "pages": 324,
  "language": "English",
  "available": true,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 3. Create New Book
**POST** `/api/books`

**Description:** Create a new book in the database.

**Request Body:**
```json
{
  "title": "1984",
  "author": "George Orwell",
  "isbn": "978-0-452-28423-4",
  "publishedYear": 1949,
  "genre": "Dystopian Fiction",
  "pages": 328,
  "language": "English",
  "available": true
}
```

**Validation Rules:**
- `title`: Required, 1-200 characters
- `author`: Required, 1-100 characters
- `isbn`: Required, valid ISBN format
- `publishedYear`: Required, between 1000 and current year
- `genre`: Required, 1-50 characters
- `pages`: Required, positive integer
- `language`: Required, 2-50 characters
- `available`: Optional, boolean (default: true)

**Response:**
- Status: `201 Created` on success
- Status: `400 Bad Request` if validation fails

**Example Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "1984",
  "author": "George Orwell",
  "isbn": "978-0-452-28423-4",
  "publishedYear": 1949,
  "genre": "Dystopian Fiction",
  "pages": 328,
  "language": "English",
  "available": true,
  "createdAt": "2024-01-15T11:00:00.000Z"
}
```

---

### 4. Update Book
**PUT** `/api/books/:id`

**Description:** Update an existing book.

**Parameters:**
- `id` (path parameter): MongoDB ObjectId

**Request Body:**
```json
{
  "title": "1984 (Updated Edition)",
  "author": "George Orwell",
  "isbn": "978-0-452-28423-4",
  "publishedYear": 1949,
  "genre": "Dystopian Fiction",
  "pages": 328,
  "language": "English",
  "available": false
}
```

**Validation:** Same as Create Book endpoint

**Response:**
- Status: `200 OK` on success
- Status: `404 Not Found` if book doesn't exist
- Status: `400 Bad Request` if validation fails

**Example Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "1984 (Updated Edition)",
  "author": "George Orwell",
  "isbn": "978-0-452-28423-4",
  "publishedYear": 1949,
  "genre": "Dystopian Fiction",
  "pages": 328,
  "language": "English",
  "available": false,
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

---

### 5. Delete Book
**DELETE** `/api/books/:id`

**Description:** Delete a book from the database.

**Parameters:**
- `id` (path parameter): MongoDB ObjectId

**Response:**
- Status: `200 OK` on success
- Status: `404 Not Found` if book doesn't exist
- Status: `400 Bad Request` if ID format is invalid

**Example Response:**
```json
{
  "message": "Book deleted successfully",
  "deletedCount": 1
}
```

---

## Authors Endpoints

### 1. Get All Authors
**GET** `/api/authors`

**Description:** Retrieve all authors from the database.

**Response:**
- Status: `200 OK`
- Body: Array of author objects

**Example Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "firstName": "Harper",
    "lastName": "Lee",
    "birthYear": 1926,
    "nationality": "American",
    "biography": "Harper Lee was an American novelist best known for her 1960 novel To Kill a Mockingbird.",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### 2. Get Author by ID
**GET** `/api/authors/:id`

**Description:** Retrieve a single author by their ID.

**Parameters:**
- `id` (path parameter): MongoDB ObjectId

**Response:**
- Status: `200 OK` if found
- Status: `404 Not Found` if author doesn't exist
- Status: `400 Bad Request` if ID format is invalid

---

### 3. Create New Author
**POST** `/api/authors`

**Description:** Create a new author in the database.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Austen",
  "birthYear": 1775,
  "nationality": "British",
  "biography": "Jane Austen was an English novelist known primarily for her six major novels including Pride and Prejudice."
}
```

**Validation Rules:**
- `firstName`: Required, 1-50 characters
- `lastName`: Required, 1-50 characters
- `birthYear`: Required, between 1000 and current year
- `nationality`: Required, 2-50 characters
- `biography`: Required, 10-1000 characters

**Response:**
- Status: `201 Created` on success
- Status: `400 Bad Request` if validation fails

---

### 4. Update Author
**PUT** `/api/authors/:id`

**Description:** Update an existing author.

**Parameters:**
- `id` (path parameter): MongoDB ObjectId

**Request Body:** Same as Create Author

**Validation:** Same as Create Author endpoint

**Response:**
- Status: `200 OK` on success
- Status: `404 Not Found` if author doesn't exist
- Status: `400 Bad Request` if validation fails

---

### 5. Delete Author
**DELETE** `/api/authors/:id`

**Description:** Delete an author from the database.

**Parameters:**
- `id` (path parameter): MongoDB ObjectId

**Response:**
- Status: `200 OK` on success
- Status: `404 Not Found` if author doesn't exist

**Example Response:**
```json
{
  "message": "Author deleted successfully",
  "deletedCount": 1
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "errors": [
    {
      "msg": "Title is required",
      "param": "title",
      "location": "body"
    }
  ]
}
```

### Not Found Error (404)
```json
{
  "error": "Book not found"
}
```

### Server Error (500)
```json
{
  "error": "Failed to fetch books",
  "message": "Detailed error message"
}
```

---

## Testing the API

### Using cURL

**Get all books:**
```bash
curl http://localhost:3000/api/books
```

**Create a book:**
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0-7432-7356-5",
    "publishedYear": 1925,
    "genre": "Fiction",
    "pages": 180,
    "language": "English",
    "available": true
  }'
```

**Update a book:**
```bash
curl -X PUT http://localhost:3000/api/books/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby (Updated)",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0-7432-7356-5",
    "publishedYear": 1925,
    "genre": "Classic Fiction",
    "pages": 180,
    "language": "English",
    "available": false
  }'
```

**Delete a book:**
```bash
curl -X DELETE http://localhost:3000/api/books/507f1f77bcf86cd799439011
```

### Using Postman or Thunder Client
1. Import the base URL
2. Create requests for each endpoint
3. Set appropriate headers (Content-Type: application/json)
4. Test with sample data

---

## Setup Instructions

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd library-management-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

4. **Run the application**
```bash
npm start
# or for development
npm run dev
```

5. **Test the API**
Navigate to `http://localhost:3000` to see the API home page.

---

## Deployment to Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your GitHub repository
4. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: 3000 (or let Render assign)
5. Deploy!

---

## MongoDB Compass Testing

1. Connect to your MongoDB cluster
2. Navigate to your database
3. View the `books` and `authors` collections
4. Verify CRUD operations reflect in the database

---

## Notes

- All dates are stored in ISO 8601 format
- ObjectIds are automatically generated by MongoDB
- Validation is performed on all input data
- Error handling is implemented for all routes
- CORS is enabled for cross-origin requests