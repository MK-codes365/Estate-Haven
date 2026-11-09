const app = require('./app');
const config = require('./config');
require('./db/seedData'); // Ensures database tables & seed data are initialized

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌿 The Serai Ridge Estate & Resort - Backend Server`);
  console.log(`📍 Location: Chikkamagaluru, Karnataka (76 Keys)`);
  console.log(`🚀 API listening on: http://localhost:${PORT}`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

