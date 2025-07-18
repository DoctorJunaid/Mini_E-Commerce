// Shared data models and utilities for SehatGlow website
class SehatGlowData {
    constructor() {
        this.products = [
            {
                id: 1,
                name: 'Beauty Radiance Cream',
                description: 'Luxurious anti-aging cream with natural botanicals and peptides for youthful, glowing skin.',
                image: 'assets/beautycream16by8.jpg',
                price: 89.99,
                rating: 4.8,
                reviews: 234,
                category: 'skincare'
            },
            {
                id: 2,
                name: 'Collagen Peptide Capsules',
                description: 'Boosts skin elasticity and supports healthy hair and nails with premium collagen.',
                image: 'assets/CollagenPeptide..jpg',
                price: 64.99,
                rating: 4.9,
                reviews: 189,
                category: 'supplements'
            },
            {
                id: 3,
                name: 'Hydrating Face Serum',
                description: 'Deep hydration serum with hyaluronic acid for radiant, supple skin.',
                image: 'assets/faceSerum16by8.jpg',
                price: 75.99,
                rating: 4.7,
                reviews: 156,
                category: 'skincare'
            },
            {
                id: 4,
                name: 'Hyaluronic Acid Serum',
                description: 'Intensive moisture boost for smooth, supple skin texture and lasting hydration.',
                image: 'assets/hydrolic serum.jpg',
                price: 68.99,
                rating: 4.6,
                reviews: 142,
                category: 'skincare'
            },
            {
                id: 5,
                name: 'Lip Enhancement Filler',
                description: 'Natural lip plumping treatment with lasting hydration and volume enhancement.',
                image: 'assets/LipFiller ..jpg',
                price: 45.99,
                rating: 4.4,
                reviews: 98,
                category: 'beauty'
            },
            {
                id: 6,
                name: 'Vitamin C Brightening Serum',
                description: 'Brightens skin tone and reduces dark spots with powerful vitamin C complex.',
                image: 'assets/Vitamin C Brightening ..jpg',
                price: 72.99,
                rating: 4.8,
                reviews: 267,
                category: 'skincare'
            }
        ];
    }

    // Product methods
    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === parseInt(id));
    }

    // User authentication methods
    static isUserLoggedIn() {
        return localStorage.getItem('sehatglow_user') !== null;
    }

    static getCurrentUser() {
        const userData = localStorage.getItem('sehatglow_user');
        return userData ? JSON.parse(userData) : null;
    }

    static loginUser(email, name = 'User') {
        const userData = {
            email: email,
            name: name,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('sehatglow_user', JSON.stringify(userData));
        return userData;
    }

    static logoutUser() {
        localStorage.removeItem('sehatglow_user');
        localStorage.removeItem('sehatglow_cart');
    }

    // Cart methods
    static getCart() {
        const cartData = localStorage.getItem('sehatglow_cart');
        return cartData ? JSON.parse(cartData) : [];
    }

    static saveCart(cartItems) {
        localStorage.setItem('sehatglow_cart', JSON.stringify(cartItems));
        this.updateCartCount();
    }

    static addToCart(productId, quantity = 1) {
        if (!this.isUserLoggedIn()) {
            this.redirectToLogin();
            return false;
        }

        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const sehatGlow = new SehatGlowData();
            const product = sehatGlow.getProductById(productId);
            if (product) {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
            }
        }
        
        this.saveCart(cart);
        return true;
    }

    static removeFromCart(productId) {
        const cart = this.getCart();
        const updatedCart = cart.filter(item => item.id !== productId);
        this.saveCart(updatedCart);
    }

    static updateCartQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart(cart);
            }
        }
    }

    static clearCart() {
        localStorage.removeItem('sehatglow_cart');
        this.updateCartCount();
    }

    static getCartTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    static getCartItemCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    static updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getCartItemCount();
        cartCountElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'inline-block' : 'none';
        });
    }

    // Navigation and utility methods
    static redirectToLogin() {
        const currentPage = window.location.pathname;
        localStorage.setItem('sehatglow_redirect', currentPage);
        window.location.href = 'login.html';
    }

    static handlePostLogin() {
        const redirectPath = localStorage.getItem('sehatglow_redirect');
        if (redirectPath && redirectPath !== '/login.html') {
            localStorage.removeItem('sehatglow_redirect');
            window.location.href = redirectPath;
        } else {
            window.location.href = 'index.html';
        }
    }

    static requireAuth() {
        if (!this.isUserLoggedIn()) {
            this.redirectToLogin();
            return false;
        }
        return true;
    }

    // UI utility methods
    static generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
        
        return '★'.repeat(fullStars) + (hasHalf ? '☆' : '') + '☆'.repeat(emptyStars);
    }

    static showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform translate-x-full`;
        
        if (type === 'success') {
            notification.classList.add('bg-green-500', 'text-white');
        } else if (type === 'error') {
            notification.classList.add('bg-red-500', 'text-white');
        } else {
            notification.classList.add('bg-blue-500', 'text-white');
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    static formatPrice(price) {
        return `$${price.toFixed(2)}`;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    SehatGlowData.updateCartCount();
});