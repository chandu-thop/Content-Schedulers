

import  express  from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getAccounts,addAccount,disconnectAccount } from "../controllers/accountController.js";



const accountRouter=express.Router();

accountRouter.get("/",protect,getAccounts);
accountRouter.post("/",protect,addAccount);
accountRouter.delete("/:id",protect,disconnectAccount);

export default accountRouter;



