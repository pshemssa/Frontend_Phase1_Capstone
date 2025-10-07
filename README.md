# Frontend_Phase1_Capstone



# 📚 Book Explorer

A modern, responsive web application for discovering and saving your favorite books.

## Features

- **Search Books** - Find books by title, author, or topic using Open Library API
-  **Save Favorites** - Add books to your favorites with localStorage persistence
-  **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
-  **Modern UI** - Beautiful design with Tailwind CSS
-  **Fast & Lightweight** - No frameworks, pure vanilla JavaScript

## 🚀 Quick Start

### Option 1: Open Directly
1. Download all files
2. Open `index.html` in your browser
3. Start exploring books!

### Option 2: Open hosted link : https://bookexplorerr.netlify.app/ 

## 📁 Project Structure

```
Frontend_Phase1_Capstone /lab3/
├── index.html          # Homepage with search & books
├── favorites.html      # Your saved favorites
├── about.html          # About page           
├──favorites.js    # Favorites management
|── index.js   
```

project setup:

# git clone https://github.com/pshemssa/Frontend_Phase1_Capstone.git
# cd Frontend_Phase1_Capstone
# cd lab 3
# start index.html


## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first styling (via CDN)
- **JavaScript ES6+** - Modern syntax with async/await
- **Open Library API** - Free book data
- **localStorage** - Client-side data persistence

## 📖 How to Use

### Search for Books
1. Type a book title, author, or topic in the search bar
2. Click "Search" or press Enter
3. Browse the results

### Add to Favorites
1. Click the "Add to Favorites" button on any book
2. Your favorites are automatically saved
3. Access them anytime from the Favorites page

### Read More
- Click "Read More" on any book to view full details on Open Library

## 🌐 API Information

This project uses the [Open Library API](https://openlibrary.org/developers/api):
- **Free** - No API key required
- **Public** - Open source book database
- **Rate Limits** - Be respectful with requests

**Example API Call:**
```
https://openlibrary.org/search.json?q=javascript&limit=20
```

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Responsive web design with Tailwind CSS
- ✅ JavaScript DOM manipulation
- ✅ Async/await for API calls
- ✅ localStorage for data persistence
- ✅ ES6 modules and modern JavaScript
- ✅ Git version control and GitHub workflow

## 🐛 Troubleshooting

**Books not loading?**
- Check your internet connection
- Open browser console (F12) to see errors
- Verify API is accessible: https://openlibrary.org/search.json?q=test

**Favorites not saving?**
- Make sure localStorage is enabled in your browser
- Check browser console for errors
- Try clearing browser cache

**Search not working?**
- Ensure JavaScript is enabled
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Check for console errors

## 🚀 Deployment

4. this site is live at https://bookexplorerr.netlify.app/ 
