// DOM Elements
const cartItemsContainer = document.querySelector('.cart-items');
const cartSummaryContainer = document.querySelector('.cart-summary');
const productForm = document.getElementById('product-form');
const productsContainer = document.querySelector('.products');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const userInfo = document.querySelector('.user-info');
const userOrders = document.querySelector('.user-orders');
const userListings = document.querySelector('.user-listings');

// Get the new cart content container
const cartContentContainer = document.querySelector('.cart-content');

// Cart functionality
let cart = [];

// Load cart from localStorage if available
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(product) {
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            location: product.location,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

// Update cart display
function updateCartDisplay() {
    // Update cart items
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p class="price">₵${item.price.toFixed(2)}</p>
                        <p class="location">${item.location}</p>
                    </div>
                    <div class="item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <div class="item-total">
                        <span>₵${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <button class="remove-btn" data-id="${item.id}">Remove</button>
                </div>
            `).join('');
            
            // Add event listeners to new buttons
            document.querySelectorAll('.quantity-btn.minus').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = parseInt(e.target.dataset.id);
                    updateQuantity(id, -1);
                });
            });
            
            document.querySelectorAll('.quantity-btn.plus').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = parseInt(e.target.dataset.id);
                    updateQuantity(id, 1);
                });
            });
            
            document.querySelectorAll('.remove-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = parseInt(e.target.dataset.id);
                    removeFromCart(id);
                });
            });
        }
    }
    
    // Update cart summary
    if (cartSummaryContainer) {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = cart.length > 0 ? 15.00 : 0;
        const total = subtotal + deliveryFee;
        
        // Update the existing summary elements instead of replacing the whole HTML
        document.querySelector('.subtotal').textContent = `₵${subtotal.toFixed(2)}`;
        document.querySelector('.delivery-fee').textContent = `₵${deliveryFee.toFixed(2)}`;
        document.querySelector('.total').textContent = `₵${total.toFixed(2)}`;
        
        // Add event listener to checkout button if it doesn't already have one
        const checkoutBtn = cartSummaryContainer.querySelector('.checkout-btn');
        if (checkoutBtn && !checkoutBtn.dataset.listenerAdded) {
            checkoutBtn.addEventListener('click', () => {
                alert('Proceeding to checkout...');
                // In a real application, this would redirect to a checkout page
            });
            checkoutBtn.dataset.listenerAdded = "true";
        }
    }
}

// Product form submission
if (productForm) {
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const productName = document.getElementById('product-name').value;
        const productDescription = document.getElementById('product-description').value;
        const productPrice = document.getElementById('product-price').value;
        const productCategory = document.getElementById('product-category').value;
        const productLocation = document.getElementById('product-location').value;
        
        // Basic validation
        if (!productName || !productDescription || !productPrice || !productCategory || !productLocation) {
            alert('Please fill in all required fields');
            return;
        }
        
        // In a real application, you would send this data to a server
        // For this demo, we'll just show a success message
        alert('Product listed successfully!');
        productForm.reset();
    });
}

// Login form submission
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Basic validation
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // Simulate login
        login(email, password);
    });
}

// Register form submission
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const location = document.getElementById('location').value;
        
        // Basic validation
        if (!name || !email || !password || !confirmPassword || !location) {
            alert('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // Simulate registration
        register(name, email, password, location);
    });
}

// Search functionality
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');

if (searchButton) {
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            // In a real application, this would search the products
            alert(`Searching for: ${searchTerm}`);
            // Redirect to products page with search query
            window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
        }
    });
}
// Also add functionality for pressing Enter in the search input
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
            }
        }
    });
}

// Add to cart buttons
document.querySelectorAll('.btn-primary').forEach(button => {
    if (button.textContent === 'Add to Cart') {
        button.addEventListener('click', (e) => {
            // In a real application, you would get the actual product data
            // For this demo, we'll use mock data
            const product = {
                id: Date.now(), // Unique ID for demo purposes
                name: 'Product Name',
                price: 29.99,
                image: 'images/product1.jpg',
                location: 'Accra, Ghana'
            };
            
            addToCart(product);
            alert('Product added to cart!');
        });
    }
});

// Load products from JSON file
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        const products = await response.json();
        displayProducts(products);
        return products;
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

// Display products
function displayProducts(products) {
    if (productsContainer) {
        productsContainer.innerHTML = products.map(product => `
            <div class="product" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">₵${product.price.toFixed(2)}</p>
                <p class="location">${product.location}</p>
                <button class="btn btn-primary add-to-cart" data-product='${JSON.stringify(product)}'>Add to Cart</button>
            </div>
        `).join('');
        
        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const product = JSON.parse(e.target.dataset.product);
                addToCart(product);
                alert(`${product.name} added to cart!`);
            });
        });
    }
}

// Initialize products on products page
if (document.querySelector('.product-listing')) {
    loadProducts();
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    
    // Update cart display on cart page
    if (document.querySelector('.cart')) {
        updateCartDisplay();
    }
    
    // Load user info on account page
    if (document.querySelector('.account')) {
        loadUserInfo();
    }
});

// User authentication simulation
const user = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    location: 'Accra, Ghana',
    isAuthenticated: false
};

// Login function (simulated)
function login(email, password) {
    // In a real application, this would verify credentials with a server
    if (email === 'user@example.com' && password === 'password') {
        user.isAuthenticated = true;
        user.name = 'John Doe';
        user.email = email;
        user.location = 'Accra, Ghana';
        localStorage.setItem('user', JSON.stringify(user));
        alert('Login successful!');
        
        // Update UI to show user is logged in
        updateAuthUI();
        
        // Redirect to account page
        window.location.href = 'account.html';
        return true;
    } else {
        alert('Invalid credentials');
        return false;
    }
}

// Register function (simulated)
function register(name, email, password, location) {
    // In a real application, this would send data to a server
    // For this demo, we'll just show a success message and redirect to login
    alert('Registration successful! Please login.');
    window.location.href = 'login.html';
}

// Logout function
function logout() {
    user.isAuthenticated = false;
    localStorage.removeItem('user');
    alert('You have been logged out');
    
    // Update UI to show user is logged out
    updateAuthUI();
    
    // Redirect to homepage
    window.location.href = 'index.html';
}

// Check if user is logged in
function checkAuth() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        user.name = userData.name;
        user.email = userData.email;
        user.location = userData.location;
        user.isAuthenticated = userData.isAuthenticated;
    }
}

// Update authentication UI
function updateAuthUI() {
    // This would update the UI to show login/logout state
    // For example, show "Logout" instead of "Login" in the navigation
}

// Load user information on account page
function loadUserInfo() {
    if (userInfo) {
        userInfo.innerHTML = `
            <h3>Personal Information</h3>
            <div class="info-item">
                <label>Name:</label>
                <span>{user.name}</span>
            </div>
            <div class="info-item">
                <label>Email:</label>
                <span>${user.email}</span>
            </div>
            <div class="info-item">
                <label>Location:</label>
                <span>${user.location}</span>
            </div>
            <button class="btn btn-secondary">Edit Information</button>
        `;
    }
    
    // In a real application, you would also load orders and listings from a database
}

// Initialize authentication
checkAuth();