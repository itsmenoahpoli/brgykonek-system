import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { connectDB } from "./config/database";
import authRoutes from "./routes/auth";
import complaintRoutes from "./routes/complaint";
import announcementRoutes from "./routes/announcement";
import administratorRoutes from "./routes/administrator";
import { swaggerOptions } from "./config/swagger";
import { requestLogger } from "./middleware/requestLogger";
import { logger } from "./utils/logger";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(requestLogger);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const specs = swaggerJsdoc(swaggerOptions);

const theme = new SwaggerTheme();
const swaggerUiOptions = {
  customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
};

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/administrator", administratorRoutes);

app.get("/", (req, res) => {
  res.json({ message: "BrgyKonek API is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server started successfully on port ${PORT}`);
      logger.info(
        `Swagger documentation available at http://localhost:${PORT}/docs`
      );
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error("Failed to start server", { error: errorMessage });
    process.exit(1);
  }
};

startServer();
