
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Root route to prevent 404 on '/'
app.get('/', (req, res) => {
	res.send('API is running');
});

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/staff", require("./routes/staff.routes"));
app.use("/api/supervisor", require("./routes/supervisor.routes"));

module.exports = app;
