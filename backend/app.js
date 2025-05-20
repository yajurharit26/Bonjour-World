const debug = require("debug");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("node:path");
const cors = require("cors");
const csurf = require("csurf");
const { isProduction } = require("./config/keys");
const passport = require("passport");

require("./models/User");
require("./models/Event");
require("./config/passport");

const app = express();
app.use(
	express.static(path.join(__dirname, "../frontend/src/components/Globe")),
);
app.use(passport.initialize());

const usersRouter = require("./routes/api/users");
const csrfRouter = require("./routes/api/csrf");
const eventsRouter = require("./routes/api/events");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set the _csrf token and create req.csrfToken method to generate a hashed CSRF token
app.use(
	csurf({
		cookie: {
			secure: isProduction,
			sameSite: isProduction && "Lax",
			httpOnly: true,
		},
	}),
);

if (isProduction) {
	const path = require("node:path");
	// Serve the frontend's index.html file at the root route
	app.get("/", (req, res) => {
		res.cookie("CSRF-TOKEN", req.csrfToken());
		res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"));
	});

	// Serve the static assets in the frontend's build folder
	app.use(express.static(path.resolve("../frontend/build")));

	// Serve the frontend's index.html file at all other routes NOT starting with /api
	app.get(/^(?!\/?api).*/, (req, res) => {
		res.cookie("CSRF-TOKEN", req.csrfToken());
		res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"));
	});
}

// Security Middleware
if (!isProduction) {
	app.use(cors());
}

// Serve static files, including images
app.use(
	express.static(path.join(__dirname, "../frontend/src/components/Globe")),
);

// Attach Express routers
app.use("/api/users", usersRouter);
app.use("/api/csrf", csrfRouter);
app.use("/api/events", eventsRouter);

app.use((req, res, next) => {
	const err = new Error("Not Found");
	err.statusCode = 404;
	next(err);
});

const serverErrorLogger = debug("backend:error");

// Express custom error handler that will be called whenever a route handler or
// middleware throws an error or invokes the `next` function with a truthy value
app.use((err, req, res, next) => {
	serverErrorLogger(err);
	const statusCode = err.statusCode || 500;
	res.status(statusCode);
	res.json({
		message: err.message,
		statusCode,
		errors: err.errors,
	});
});

module.exports = app;
