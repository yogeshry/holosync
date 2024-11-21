const app = require('./src/app');
const { PORT } = require('./src/config/environment');

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
