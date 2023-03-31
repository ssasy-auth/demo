import express from "express";
import type { Router } from "express";
import { 
  postChallenge,
  postRegister,
  postLogin,
  verifyAccessToken,
  fetchAllUsers, 
  fetchUserById,
  fetchUserByPublicKey,
  postThought,
  fetchThought,
  fetchAllThoughts
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
  { path: "/users/:id", method: "get", middleware: [fetchUserById] },
  { path: "/users/:x/:y", method: "get", middleware: [fetchUserByPublicKey] },
  { path: "/users", method: "get", middleware: [fetchAllUsers] },

  // status routes
  { path: "/thoughts", method: "post", middleware: [verifyAccessToken, postThought], restricted: true },
  { path: "/thoughts/:id", method: "get", middleware: [fetchThought] },
  { path: "/thoughts", method: "get", middleware: [fetchAllThoughts] },
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