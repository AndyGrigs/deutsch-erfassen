const app = require('./server');
const { supabase } = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Test the Supabase connection
// In a real application, you might want to perform a simple query to verify the connection
console.log('Supabase client initialized');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});