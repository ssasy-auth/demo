import { Enviroment } from "./config";
import express from "express";
import cors from "cors";
import database from "./database";
import router from "./router";

const app = express();

// allow CORS
app.use(cors());

// allow parsing of JSON
app.use(express.json());

// log responses to console
app.use((req, res, next) => {
	res.on("finish", () => {
		console.log(`${req.method} ${req.path} ${res.statusCode}`);
	});
	next();
});

// use router
app.use(router);

// connect to database
database.connect().then(() => {

  // start server once connected to database
	app.listen(Enviroment.PORT, () => {
		console.log(`Server running on port ${Enviroment.PORT}`);
	});
});
