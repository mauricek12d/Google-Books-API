# 📚 Google Books Search Engine

A full-stack MERN application that allows users to search for books using the **Google Books API**, save their favorite books to their profile, and remove them when desired. The project has been refactored to use **GraphQL with Apollo Server**, replacing the previous RESTful API.

## 🚀 Live Demo
🔗 [Deployed Application on Render](https://google-books-api-3prl.onrender.com)

---

## 🛠️ Technologies Used
- **MongoDB Atlas** – NoSQL database for storing user and book data
- **Express.js** – Backend server framework
- **React.js** – Frontend user interface
- **Node.js** – JavaScript runtime environment
- **GraphQL & Apollo Server** – API for queries and mutations
- **JWT (JSON Web Token)** – Authentication & authorization
- **Mongoose** – MongoDB object modeling
- **TypeScript** – Strongly typed JavaScript for better development experience

---

## 📦 Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/mauricek12d/Google-Books-API.git
   cd Google-Books-API

2. **Install Dependencies 
```sh
cd server
npm install
cd ../client
npm install
```

3. **Set up the .env file Create a .env file in the server directory and add:
```sh
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET_KEY=your-super-secret-key
```

4. **Run the application locally
```
# Start the server
cd server
npm run dev

# Start the frontend
cd ../client
npm run dev
```



🛠️ Usage

🔍 Searching for Books
Type a keyword in the search bar.
View book results retrieved from the Google Books API.
Click Save Book to store it in your account.

📚 Viewing & Managing Saved Books

Navigate to the Saved Books page.
View your list of saved books.
Click Delete to remove a book from your collection.

🔐 Authentication

Sign Up – Create an account with a username, email, and password.
Login – Access your saved books across sessions.
Logout – Clears the JWT token and logs you out.

📌 Features
 GraphQL API with Apollo Server
 JWT authentication for user security
 MERN stack with TypeScript
 Responsive UI built with React & Bootstrap
 MongoDB Atlas database integration
 Hosted on Render with CI/CD deployment

 🐛 Issues & Future Improvements
Improve UI/UX styling.
Implement advanced search filtering.
Allow users to add personal notes to saved books.

Screenshots
![Search Page](https://github.com/mauricek12d/Google-Books-API/blob/main/Search.png)
![Saved Page](https://github.com/mauricek12d/Google-Books-API/blob/main/Search.png)



🤝 Contributors
Maurice Zuniga – github.com/mauricek12d

