
    
        const API_BASE_URL = 'https://openlibrary.org';

        // Fetch books by search query
        async function searchBooks(query, limit = 20) {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`
                );
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                return formatBooks(data.docs);
            } catch (error) {
                console.error('Error fetching books:', error);
                throw error;
            }
        }

        // Fetch trending/popular books
        async function fetchTrendingBooks(subject = 'popular', limit = 20) {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/subjects/${subject}.json?limit=${limit}`
                );
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                return formatBooksFromSubject(data.works);
            } catch (error) {
                console.error('Error fetching trending books:', error);
                throw error;
            }
        }

        // Format book data from search results
        function formatBooks(docs) {
            return docs.map(doc => ({
                id: doc.key || doc.cover_edition_key || `book-${Math.random()}`,
                title: doc.title || 'Unknown Title',
                author: doc.author_name ? doc.author_name[0] : 'Unknown Author',
                year: doc.first_publish_year || 'N/A',
                cover: doc.cover_i 
                    ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
                    : 'https://via.placeholder.com/300x400?text=No+Cover',
                isbn: doc.isbn ? doc.isbn[0] : null,
                bookUrl: doc.key ? `https://openlibrary.org${doc.key}` : null
            }));
        }

        // Format book data from subject results
        function formatBooksFromSubject(works) {
            return works.map(work => ({
                id: work.key || `book-${Math.random()}`,
                title: work.title || 'Unknown Title',
                author: work.authors && work.authors[0] ? work.authors[0].name : 'Unknown Author',
                year: work.first_publish_year || 'N/A',
                cover: work.cover_id 
                    ? `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg`
                    : 'https://via.placeholder.com/300x400?text=No+Cover',
                bookUrl: work.key ? `https://openlibrary.org${work.key}` : null
            }));
        }

        const fetchBooksModule = {
            searchBooks,
            fetchTrendingBooks
        };

        // ===== favorites.js module =====
        const STORAGE_KEY = 'bookExplorerFavorites';

        function getFavorites() {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        }

        function saveFavorites(favorites) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        }

        function addFavorite(book) {
            const favorites = getFavorites();
            const exists = favorites.some(fav => fav.id === book.id);
            
            if (exists) {
                return { success: false, message: 'Book already in favorites!' };
            }
            
            favorites.push(book);
            saveFavorites(favorites);
            return { success: true, message: 'Book added to favorites!' };
        }

        function removeFavorite(bookId) {
            let favorites = getFavorites();
            favorites = favorites.filter(book => book.id !== bookId);
            saveFavorites(favorites);
            return { success: true, message: 'Book removed from favorites!' };
        }

        function isFavorite(bookId) {
            const favorites = getFavorites();
            return favorites.some(book => book.id === bookId);
        }

        const favoritesModule = {
            getFavorites,
            addFavorite,
            removeFavorite,
            isFavorite
        };

        // ===== DOM Elements =====
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const clearSearchBtn = document.getElementById('clear-search-btn');
        const booksGrid = document.getElementById('books-grid');
        const loading = document.getElementById('loading');
        const noResults = document.getElementById('no-results');
        const errorMessage = document.getElementById('error-message');
        const resultsTitle = document.getElementById('results-title');
        const resultsSubtitle = document.getElementById('results-subtitle');
        const browsePopularBtn = document.getElementById('browse-popular-btn');
        const retryBtn = document.getElementById('retry-btn');
        const browseBooksLink = document.querySelector('a[href="#books-grid"]');

        // State
        let currentBooks = [];
        let isSearchMode = false;

        // Mobile menu toggle
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Show notification
        function showNotification(message, type = 'info') {
            const colors = {
                success: 'bg-pink-400',
                error: 'bg-red-500',
                info: 'bg-pink-800'
            };
            
            const notification = document.createElement('div');
            notification.className = `fixed top-20 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('opacity-0', 'transition-opacity');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // Update favorites badge in navigation
        function updateFavoritesBadge() {
            const badge = document.getElementById('nav-favorites-badge');
            const count = favoritesModule.getFavorites().length;
            
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }

        // Toggle UI states (Exercise 3.4)
        function showLoading() {
            loading.classList.remove('hidden');
            booksGrid.classList.add('hidden');
            noResults.classList.add('hidden');  
            errorMessage.classList.add('hidden');
        }

        function showBooks() {
            loading.classList.add('hidden');
            booksGrid.classList.remove('hidden');
            noResults.classList.add('hidden');
            errorMessage.classList.add('hidden');
        }

        function showNoResults() {
            loading.classList.add('hidden');
            booksGrid.classList.add('hidden');
            noResults.classList.remove('hidden');
            errorMessage.classList.add('hidden');
        }

        function showError() {
            loading.classList.add('hidden');
            booksGrid.classList.add('hidden');
            noResults.classList.add('hidden');
            errorMessage.classList.remove('hidden');
        }

        // Function to create book card HTML
        function createBookCard(book) {
            const isFav = favoritesModule.isFavorite(book.id);
            
            return `
                <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <div class="aspect-w-2 aspect-h-3 bg-gray-200 relative">
                        <img 
                            src="${book.cover}" 
                            alt="${book.title}"
                            class="w-full h-64 object-cover"
                            onerror="this.src='https://via.placeholder.com/300x400?text=No+Cover'"
                        >
                        ${isFav ? '<div class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg></div>' : ''}
                    </div>
                    <div class="p-4">
                        <h3 class="font-bold text-lg text-gray-800 mb-1 line-clamp-2">${book.title}</h3>
                        <p class="text-gray-600 text-sm mb-2">${book.author}</p>
                        <p class="text-gray-500 text-xs mb-3">${book.year}</p>
                        <button 
                            class="favorite-btn w-full ${isFav ? 'bg-red-600 hover:bg-pink-600' : 'bg-pink-400 hover:bg-red-300'} text-white font-semibold py-2 px-4 rounded transition"
                            data-book='${JSON.stringify(book).replace(/'/g, "&apos;")}'
                            data-is-favorite="${isFav}"
                        >
                            ${isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                    </div>
                </div>
            `;
        }

        // Render books on page
        function renderBooks(books) {
            if (books.length === 0) {
                showNoResults();
                return;
            }

            currentBooks = books;
            booksGrid.innerHTML = books.map(book => createBookCard(book)).join('');
            showBooks();
            
            // Add event listeners to favorite buttons
            document.querySelectorAll('.favorite-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const book = JSON.parse(e.target.getAttribute('data-book'));
                    const isFav = e.target.getAttribute('data-is-favorite') === 'true';
                    
                    let result;
                    if (isFav) {
                        result = favoritesModule.removeFavorite(book.id);
                        showNotification(result.message, 'success');
                    } else {
                        result = favoritesModule.addFavorite(book);
                        showNotification(result.message, result.success ? 'success' : 'error');
                    }
                    
                    // Re-render to update button states
                    renderBooks(currentBooks);
                    updateFavoritesBadge();
                });
            });
        }

        // Scroll to books grid
        function scrollToBooksGrid() {
            const booksGrid = document.getElementById('books-grid');
            booksGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Exercise 3.3: Search Functionality
        async function performSearch(query) {
            if (!query.trim()) {
                showNotification('Please enter a search term', 'error');
                return;
            }

            isSearchMode = true;
            clearSearchBtn.classList.remove('hidden');
            resultsTitle.textContent = `Search Results for "${query}"`;
            resultsSubtitle.textContent = 'Powered by Open Library';

            showLoading();

            try {
                const books = await fetchBooksModule.searchBooks(query);
                renderBooks(books);
                scrollToBooksGrid();
            } catch (error) {
                showError();
            }
        }

        // Load trending books (Exercise 3.2)
        async function loadTrendingBooks() {
            isSearchMode = false;
            clearSearchBtn.classList.add('hidden');
            resultsTitle.textContent = 'Popular Books';
            resultsSubtitle.textContent = 'Browse our collection of amazing books';
            searchInput.value = '';

            showLoading();

            try {
                const books = await fetchBooksModule.fetchTrendingBooks('fiction', 24);
                renderBooks(books);
                scrollToBooksGrid();
            } catch (error) {
                showError();
            }
        }

        // Event Listeners
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value;
            performSearch(query);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });

        clearSearchBtn.addEventListener('click', loadTrendingBooks);
        browsePopularBtn.addEventListener('click', loadTrendingBooks);
        retryBtn.addEventListener('click', () => {
            if (isSearchMode) {
                performSearch(searchInput.value);
            } else {
                loadTrendingBooks();
            }
        });

        browseBooksLink.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior
            loadTrendingBooks();
        });

        // Initial load
        updateFavoritesBadge();
        loadTrendingBooks();
    