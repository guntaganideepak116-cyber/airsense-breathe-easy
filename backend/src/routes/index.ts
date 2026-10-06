import { Router } from "express";
import deviceRoutes from "./deviceRoutes.js";
import weatherRoutes from "./weatherRoutes.js";
import userRoutes from "./userRoutes.js";
import alertRoutes from "./alertRoutes.js";
import pushRoutes from "./pushRoutes.js";
import aiRoutes from "./aiRoutes.js";

const apiRouter = Router();

apiRouter.use(deviceRoutes);
apiRouter.use(weatherRoutes);
apiRouter.use(userRoutes);
apiRouter.use(alertRoutes);
apiRouter.use(pushRoutes);
apiRouter.use(aiRoutes);

export default apiRouter;
