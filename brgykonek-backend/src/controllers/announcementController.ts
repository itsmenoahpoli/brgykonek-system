import { Request, Response } from "express";
import * as announcementService from "../services/announcementService";

export const create = async (req: Request, res: Response) => {
  try {
    if (req.file) {
      req.body.banner_image = req.file.path;
    }
    const announcement = await announcementService.createAnnouncement(req.body);
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const announcements = await announcementService.getAnnouncements();
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const announcement = await announcementService.getAnnouncementById(
      req.params.id
    );
    if (!announcement)
      return res.status(404).json({ error: "Announcement not found" });
    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    if (req.file) {
      req.body.banner_image = req.file.path;
    }
    const announcement = await announcementService.updateAnnouncement(
      req.params.id,
      req.body
    );
    if (!announcement)
      return res.status(404).json({ error: "Announcement not found" });
    res.status(200).json(announcement);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const announcement = await announcementService.deleteAnnouncement(
      req.params.id
    );
    if (!announcement)
      return res.status(404).json({ error: "Announcement not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
