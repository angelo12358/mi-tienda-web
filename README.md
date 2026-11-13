# TechStore - E-commerce Website

A modern, responsive 5-page technology store website built with HTML, CSS, and JavaScript.

## 📋 Project Overview

TechStore is a fully functional e-commerce website showcasing technology products with a professional design and interactive features. The site includes product browsing, shopping cart functionality, and contact management.

## 🌐 Pages

1. **Home (index.html)** - Landing page with hero section, promotions, and featured products
2. **Products (productos.html)** - Full product catalog with category filtering
3. **Shopping Cart (carrito.html)** - Cart management with real-time calculations
4. **About (acerca-de.html)** - Company information, mission, team, and statistics
5. **Contact (contacto.html)** - Contact form and business information

## ✨ Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Product Filtering** - Filter products by categories (Laptops, Smartphones, Tablets, Accessories)
- **Shopping Cart** - Add/remove products, update quantities, automatic total calculations
- **Local Storage** - Cart data persists in browser using localStorage
- **Form Validation** - Contact form with required field validation
- **Notifications** - Visual feedback when adding products to cart
- **Professional Styling** - Modern CSS with smooth transitions and hover effects
- **Bilingual** - Available in Spanish and English

## 📁 File Structure

```
mi-tienda-web/
├── index.html          # Home page
├── productos.html      # Products page
├── carrito.html        # Shopping cart page
├── acerca-de.html      # About page
├── contacto.html       # Contact page
├── styles.css          # Main stylesheet
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required

### Installation

1. Download or clone the project files
2. Open `index.html` in your web browser
3. Or use Live Server extension in VS Code:
   - Right-click on `index.html`
   - Select "Open with Live Server"

## 💻 Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6)** - Interactive functionality and state management
- **LocalStorage API** - Client-side data persistence

## 🎨 Design Features

### Colors
- Primary: #2563eb (Blue)
- Secondary: #1e40af (Dark Blue)
- Accent: #f59e0b (Amber)
- Light Gray: #f3f4f6

### Layout
- Maximum width: 1200px
- Grid-based product layouts
- Sticky navigation bar
- Responsive breakpoints for mobile and tablet

## 🛒 Shopping Cart Functionality

- **Add to Cart** - Click "Add to Cart" button on any product
- **Update Quantity** - Change quantity in cart page
- **Remove Items** - Delete products from cart
- **Auto Calculations** - Subtotal, shipping, taxes calculated automatically
- **Free Shipping** - Orders over $100 get free shipping
- **Tax Rate** - 10% tax applied to all orders

## 📞 Contact Form

The contact form includes:
- Name field (required)
- Email field (required)
- Phone number (optional)
- Subject dropdown with predefined options
- Message textarea (required)
- Success/error feedback messages

## 🔧 Customization

### Change Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --accent-color: #f59e0b;
    /* ... more colors ... */
}
```

### Add Products
Add new product cards in `productos.html`:
```html
<div class="product-card" data-category="category-name">
    <img src="image-url" alt="product-name">
    <h3>Product Name</h3>
    <p class="price">$999.99</p>
    <p class="description">Product description</p>
    <button class="btn btn-secondary" onclick="addToCart('Product Name', 999.99)">Add to Cart</button>
</div>
```

### Modify Shipping Cost
In `script.js`, find the `updateCartSummary()` function:
```javascript
const shipping = subtotal > 100 ? 0 : 10; // Change 10 to desired amount
```

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px

## 🌍 Language Support

The website is available in:
- English (default)
- Spanish

To switch languages, you can create language files or use translation libraries.

## 🔐 Security Notes

- This is a demonstration site
- Payment processing is simulated
- No actual transactions are processed
- For production use, integrate real payment gateways (Stripe, PayPal, etc.)
- Form data should be sent to a backend server for processing

## 🐛 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] User authentication and accounts
- [ ] Product search functionality
- [ ] Customer reviews and ratings
- [ ] Wishlist feature
- [ ] Order history
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Database integration
- [ ] API backend

## 📄 License

This project is free to use for educational and personal purposes.

## 👨‍💻 Author

Created as a demonstration of modern web development practices using HTML, CSS, and JavaScript.

## 📧 Support

For questions or suggestions about this project, feel free to reach out through the contact form on the website.

---

**Note:** This is a frontend demonstration. For production use, implement proper backend functionality, security measures, and payment processing systems.
