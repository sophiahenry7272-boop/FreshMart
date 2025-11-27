// products.js

// Main array containing all product objects
// products.js
const products = [
  { id: 'prod001', name: 'Apples', category: 'fruits', price: 300, unit: '/ kg', description: 'Crisp and sweet organic Fuji apples.', imageSrc: 'https://images.pexels.com/photos/209339/pexels-photo-209339.jpeg' },
  { id: 'prod002', name: 'Bananas', category: 'fruits', price: 120, unit: '/ kg', description: 'Naturally ripened fresh bananas.', imageSrc: 'https://images.pexels.com/photos/2875814/pexels-photo-2875814.jpeg' },
  { id: 'prod003', name: 'Spinach', category: 'vegetables', price: 150, unit: '/ kg', description: 'Fresh organic baby spinach leaves.', imageSrc: 'https://images.pexels.com/photos/1751149/pexels-photo-1751149.jpeg' },
  { id: 'prod004', name: 'Milk', category: 'dairy', price: 220, unit: '/ kg', description: 'Fresh whole milk, grade A pasteurized.', imageSrc: 'https://images.pexels.com/photos/2198626/pexels-photo-2198626.jpeg' },
  { id: 'prod005', name: 'Potato Chips', category: 'snacks', price: 20, unit: '', description: 'Classic salted potato chips, crispy.', imageSrc: 'https://images.pexels.com/photos/479628/pexels-photo-479628.jpeg' },
  { id: 'prod006', name: 'Carrots', category: 'vegetables', price: 150, unit: '/ kg', description: 'Sweet and crunchy organic carrots.', imageSrc: 'https://images.pexels.com/photos/6631952/pexels-photo-6631952.jpeg' },
  { id: 'prod007', name: 'Cheddar Cheese', category: 'dairy', price: 520, unit: '/ block', description: 'Sharp cheddar cheese block, 8oz.', imageSrc: 'https://images.pexels.com/photos/139746/pexels-photo-139746.jpeg' },
  { id: 'prod008', name: 'Bread', category: 'bakery', price: 100, unit: '/ loaf', description: 'Sliced whole wheat sandwich bread.', imageSrc: 'https://images.pexels.com/photos/1209029/pexels-photo-1209029.jpeg' },
  { id: 'prod009', name: 'Strawberries', category: 'fruits', price: 600, unit: '/ pint', description: 'Fresh, juicy local strawberries.', imageSrc: 'https://images.pexels.com/photos/2820144/pexels-photo-2820144.jpeg' },
  { id: 'prod010', name: 'Greek Yogurt', category: 'dairy', price: 200, unit: '/ kg', description: 'Plain Greek yogurt, high protein.', imageSrc: 'https://images.pexels.com/photos/414262/pexels-photo-414262.jpeg' },
  { id: 'prod011', name: 'Broccoli', category: 'vegetables', price: 220, unit: '/ kg', description: 'Fresh cut broccoli florets.', imageSrc: 'https://media.istockphoto.com/id/1301178557/photo/raw-broccoli-in-hand.jpg' },
  { id: 'prod012', name: 'Chocolate Chip Cookies', category: 'bakery', price: 50, unit: '/ dozen', description: 'Classic bakery-style chocolate chip cookies.', imageSrc: 'https://images.pexels.com/photos/3250406/pexels-photo-3250406.jpeg' }
];

const bestsellerIds = ['prod001','prod004','prod008','prod011','prod005'];

console.log("products.js loaded successfully."); // Optional: confirmation
