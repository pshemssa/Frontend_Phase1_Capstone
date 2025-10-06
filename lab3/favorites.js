
        // favorites.js module (Exercise 2.2)
        const STORAGE_KEY = 'bookExplorerFavorites';

        // Get all favorites from localStorage
        function getFavorites() {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        }

        // Save favorites to localStorage
        function saveFavorites(favorites) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        }

        // Add a book to favorites
        function addFavorite(book) {
            const favorites = getFavorites();
            
            // Check if already exists
            const exists = favorites.some(fav => fav.id === book.id);
            if (exists) {
                return { success: false, message: 'Book already in favorites!' };
            }
            
            favorites.push(book);
            saveFavorites(favorites);
            return { success: true, message: 'Book added to favorites!' };
        }

        // Remove a book from favorites
        function removeFavorite(bookId) {
            let favorites = getFavorites();
            favorites = favorites.filter(book => book.id !== bookId);
            saveFavorites(favorites);
            return { success: true, message: 'Book removed from favorites!' };
        }

        // Check if a book is in favorites
        function isFavorite(bookId) {
            const favorites = getFavorites();
            return favorites.some(book => book.id === bookId);
        }

        // Clear all favorites
        function clearAllFavorites() {
            localStorage.removeItem(STORAGE_KEY);
            return { success: true, message: 'All favorites cleared!' };
        }

        // Export functions (simulated module export)
        const favoritesModule = {
            getFavorites,
            addFavorite,
            removeFavorite,
            isFavorite,
            clearAllFavorites
        };

        // DOM Elements
        const favoritesGrid = document.getElementById('favorites-grid');
        const emptyState = document.getElementById('empty-state');
        const favoritesCount = document.getElementById('favorites-count');
        const clearAllBtn = document.getElementById('clear-all-btn');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        // Mobile menu toggle
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Function to create favorite book card HTML
        function createFavoriteCard(book) {
            return `
                <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <div class="aspect-w-2 aspect-h-3 bg-gray-200">
                        <img 
                            src="${book.cover}" 
                            alt="${book.title}"
                            class="w-full h-64 object-cover"
                            onerror="this.src='https://via.placeholder.com/300x400?text=No+Cover'"
                        >
                    </div>
                    <div class="p-4">
                        <h3 class="font-bold text-lg text-gray-800 mb-1 line-clamp-2">${book.title}</h3>
                        <p class="text-gray-600 text-sm mb-2">${book.author}</p>
                        <p class="text-gray-500 text-xs mb-3">${book.year}</p>
                        
                        <div class="space-y-2">
                            ${book.bookUrl ? `
                            <a 
                                href="${book.bookUrl}" 
                                target="_blank"
                                rel="noopener noreferrer"
                                class="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition text-center"
                            >
                                📖 Read More
                            </a>
                            ` : ''}
                            
                            <button 
                                class="remove-favorite-btn w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition flex items-center justify-center gap-2"
                                data-book-id="${book.id}"
                            >
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        // Render favorites (Exercise 2.3 - DOM Events)
        function renderFavorites() {
            const favorites = favoritesModule.getFavorites();
            
            // Update count
            favoritesCount.textContent = favorites.length;
            
            // Toggle empty state vs grid
            if (favorites.length === 0) {
                emptyState.classList.remove('hidden');
                favoritesGrid.classList.add('hidden');
                clearAllBtn.disabled = true;
            } else {
                emptyState.classList.add('hidden');
                favoritesGrid.classList.remove('hidden');
                clearAllBtn.disabled = false;
                
                // Render cards
                favoritesGrid.innerHTML = favorites.map(book => createFavoriteCard(book)).join('');
                
                // Add event listeners to remove buttons
                document.querySelectorAll('.remove-favorite-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const bookId = e.currentTarget.getAttribute('data-book-id');
                        const result = favoritesModule.removeFavorite(bookId);
                        
                        if (result.success) {
                            showNotification(result.message, 'success');
                            renderFavorites(); // Re-render
                        }
                    });
                });
            }
        }

        // Clear all favorites
        clearAllBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to remove all favorites? This cannot be undone.')) {
                const result = favoritesModule.clearAllFavorites();
                showNotification(result.message, 'success');
                renderFavorites();
            }
        });

        // Show notification
        function showNotification(message, type = 'info') {
            const colors = {
                success: 'bg-green-500',
                error: 'bg-red-500',
                info: 'bg-blue-500'
            };
            
            const notification = document.createElement('div');
            notification.className = `fixed top-20 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('opacity-0', 'transition-opacity');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // Initial render
        renderFavorites();

        // Make favoritesModule globally available for the homepage
        window.favoritesModule = favoritesModule;
        window.showNotification = showNotification;
    