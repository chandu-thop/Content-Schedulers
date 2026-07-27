import express from "express";

import {generateAuthUrl,syncAccounts} from "../controllers/socialAuthController.js";
import { protect } from "../middlewares/authMiddleWare.js";

const socialAuthRouter = express.Router();


socialAuthRouter.get('/:platform/url',protect,generateAuthUrl);
socialAuthRouter.get('/:sync/url',protect,syncAccounts); 

export default socialAuthRouter;
