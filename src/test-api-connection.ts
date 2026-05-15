// Test API connection
import { buildApiUrl } from '@/config/api';

console.log('=== API CONNECTION TEST ===');
console.log('Base URL:', import.meta.env.VITE_API_BASE_URL || '/api');
console.log('Filter URL:', buildApiUrl('/products/filter?category=beldi'));
console.log('Products URL:', buildApiUrl('/products'));

// Test actual API call
fetch(buildApiUrl('/products/filter?category=beldi'))
  .then(response => {
    console.log('Response Status:', response.status);
    console.log('Response OK:', response.ok);
    return response.json();
  })
  .then(data => {
    console.log('Response Data:', data);
  })
  .catch(error => {
    console.error('API Error:', error);
  });
