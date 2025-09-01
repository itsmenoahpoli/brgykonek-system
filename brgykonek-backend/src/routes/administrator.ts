/**
 * @swagger
 * tags:
 *   name: Administrator
 *   description: Administrator management and dashboard endpoints
 */

import { Router } from "express";
import * as administratorController from "../controllers/administratorController";
import { authenticateToken, isAdmin } from "../middleware/auth";
import * as dashboardOverviewController from "../controllers/dashboardOverviewController";

const router = Router();

/**
 * @swagger
 * /api/administrator/users:
 *   get:
 *     summary: Get all users
 *     tags: [Administrator]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get(
  "/users",
  authenticateToken,
  isAdmin,
  administratorController.listUsers
);

/**
 * @swagger
 * /api/administrator/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Administrator]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get(
  "/users/:id",
  authenticateToken,
  isAdmin,
  administratorController.getUserById
);

/**
 * @swagger
 * /api/administrator/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Administrator]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post(
  "/users",
  authenticateToken,
  isAdmin,
  administratorController.createUser
);

/**
 * @swagger
 * /api/administrator/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Administrator]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.put(
  "/users/:id",
  authenticateToken,
  isAdmin,
  administratorController.updateUserById
);

/**
 * @swagger
 * /api/administrator/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Administrator]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       204:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete(
  "/users/:id",
  authenticateToken,
  isAdmin,
  administratorController.deleteUserById
);

/**
 * @swagger
 * /api/administrator/overview-statistics:
 *   get:
 *     summary: Get dashboard overview statistics
 *     tags: [Administrator]
 *     responses:
 *       200:
 *         description: Overview statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalComplaints:
 *                   type: integer
 *                   example: 42
 *                 totalActiveAnnouncements:
 *                   type: integer
 *                   example: 10
 *                 totalResidents:
 *                   type: integer
 *                   example: 1000
 */
router.get(
  "/overview-statistics",
  dashboardOverviewController.getOverviewStatistics
);

export default router;
