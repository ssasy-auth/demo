import express from "express";
import type { Router } from "express";
import { 
  postChallenge,
  postRegister,
  postLogin,
  verifyAccessToken,
  fetchAllUsers, 
  fetchUserByPublicKey,
  postStatus,
  fetchStatus,
  fetchAllStatuses
} from "../middleware";

const router: Router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the SSASy demo server!");
});

interface Route {
  path: string;
  method: "get" | "post" | "put" | "delete";
  middleware: express.RequestHandler[];
  restricted?: boolean;
}

// add routes here
const routes: Route[] = [
  // auth routes
  { path: "/auth/challenge", method: "post", middleware: [postChallenge] },
  { path: "/auth/register", method: "post", middleware: [postRegister] },
  { path: "/auth/login", method: "post", middleware: [postLogin] },

  // user routes
  { path: "/users/:x/:y", method: "get", middleware: [fetchUserByPublicKey] },
  { path: "/users", method: "get", middleware: [fetchAllUsers] },

  // status routes
  { path: "/status", method: "post", middleware: [verifyAccessToken, postStatus], restricted: true },
  { path: "/status/:id", method: "get", middleware: [fetchStatus] },
  { path: "/status", method: "get", middleware: [fetchAllStatuses] },
];

routes.forEach((route) => {
  // get all route properties
  const { path, method, middleware, restricted } = route;

  if(restricted){
    
    // add verifyAccessToken middleware if route is protected
    router[method](path, verifyAccessToken, ...middleware);
  }

  else {
    // add handler to middleware
    router[method](path, ...middleware);
  }
});

export default router;