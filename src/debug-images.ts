// Debug script to test image mapping
import { mapProductListItemToProduct } from '@/utils/productMapper';

// Test data from backend
const testProducts = [
  {
    id: "2",
    name: "Parure Complète Royale",
    category: "beldi",
    images: []
  },
  {
    id: "4", 
    name: "Bague Diamant Solitaire",
    category: "modern",
    images: []
  }
];

console.log('=== IMAGE MAPPING DEBUG ===');
testProducts.forEach(product => {
  const mapped = mapProductListItemToProduct({
    ...product,
    price: 0,
    weight: 0,
    type: 'ring',
    goldType: 'yellow',
  });
  console.log(`Product: ${product.name}`);
  console.log(`Category: ${product.category}`);
  console.log(`Original images:`, product.images);
  console.log(`Mapped images:`, mapped.images);
  console.log('---');
});
