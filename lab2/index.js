  const placeholderBooks = [
            {
                id: "book-1",
                title: "Cold Light",
                author: "Jane",
                year: "2021",
                cover: "../Images/cold light.jpg"
            },
            {
                id: "book-2",
                title: "It Ends with Us",
                author: "Kurt Castiel",
                year: "2021",
                cover: "../Images/It ends with us.jpg"
            },
            {
                id: "book-3",
                title: "Love Triangle",
                author: "Kursten Parker",
                year: "2021",
                cover: "../Images/Love triangle.jpg"
            },
            {
                id: "book-4",
                title: "Resurrected",
                author: "Pr. John",
                year: "2021",
                cover: "../Images/resurrected.jpg"
            },
            {
                id: "book-5",
                title: "Take Me Home",
                author: "Jane",
                year: "2021",
                cover: "../Images/Takeme Home.jpg"
            },
            {
                id: "book-6",
                title: "Lost Orphan",
                author: "Jane",
                year: "2021",
                cover: "../Images/Lost Orphan.jpg"
            },
            {
                id: "book-7",
                title: "Adventurous Hindi",
                author: "Jane",
                year: "2021",
                cover: "../Images/Adventurous Hindi.jpg"
            }
        ];

        // favorites.js module
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

        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Show notification
        function showNotification(message, type = 'info') {
            const colors = {
                success: 'bg-pink-500',
                error: 'bg-red-500',
                info: 'bg-pink-500'
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

        // Scroll to books grid
        function scrollToBooksGrid() {
            const booksGrid = document.getElementById('books-grid');
            booksGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Function to create book card HTML
        function createBookCard(book) {
            const isFav = favoritesModule.isFavorite(book.id);
            
            return `
                <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden w-full">
                    <div class="aspect-w-2 aspect-h-3 bg-gray-200 relative">
                        <img 
                            src="${book.cover}" 
                            alt="${book.title}"
                            class="w-full h-48 sm:h-56 md:h-64 object-cover"
                            onerror="this.src='https://via.placeholder.com/300x400?text=No+Cover'"
                        >
                        ${isFav ? '<div class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg></div>' : ''}
                    </div>
                    <div class="p-4">
                        <h3 class="font-bold text-lg sm:text-xl text-gray-800 mb-1 line-clamp-2">${book.title}</h3>
                        <p class="text-gray-600 text-sm sm:text-sm mb-2">${book.author}</p>
                        <p class="text-gray-500 text-xs mb-3">${book.year}</p>
                        <button 
                            class="favorite-btn w-full ${isFav ? 'bg-red-500 hover:bg-red-600' : 'bg-pink-400 hover:bg-red-300'} text-white font-semibold py-2 px-4 sm:py-2.5 sm:px-6 rounded transition"
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
            const grid = document.getElementById('books-grid');
            grid.innerHTML = books.map(book => createBookCard(book)).join('');
            
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
                    
                    // Re-render to update button states and scroll to grid
                    renderBooks(placeholderBooks);
                    updateFavoritesBadge();
                    scrollToBooksGrid();
                });
            });
        }

        // Search functionality placeholder
        document.getElementById('search-btn').addEventListener('click', () => {
            const query = document.getElementById('search-input').value;
            if (query.trim()) {
                alert(`Search functionality will be implemented in Lab 3. Searching for: "${query}"`);
                scrollToBooksGrid();
            }
        });

        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('search-btn').click();
            }
        });

        // Browse books link
        document.querySelector('a[href="#books-grid"]').addEventListener('click', (e) => {
            e.preventDefault();
            scrollToBooksGrid();
        });

        // Initial render
        renderBooks(placeholderBooks);
        updateFavoritesBadge();
   