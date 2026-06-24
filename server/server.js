require("dotenv").config();
const app = require("./app");
require("./config/db")();

const PORT = process.env.PORT || 5000;
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});