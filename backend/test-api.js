const axios = require('axios');

async function testRegister() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: '123456'
    });
    console.log('✅ Register success:', response.data);
  } catch (error) {
    console.error('❌ Register failed:', error.response?.data || error.message);
  }
}

testRegister();