import { Request, Response } from "express";
import * as announcementService from "../services/announcementService";

export const create = async (req: Request, res: Response) => {
  try {
    if (req.file) {
      // Store the file path for database
      req.body.banner_image = `/public/images/announcements/${req.file.filename}`;
    }
    if (req.body.created_by) {
      req.body.posted_by = req.body.created_by;
      delete req.body.created_by;
    }
    if (!req.body.title_slug && req.body.title) {
      req.body.title_slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    
    // Map frontend audience values to backend enum values
    const audienceMapping: { [key: string]: string } = {
      'All Residents': 'all_residents',
      'Specific Zone': 'specific_zone',
      'Staff Only': 'staff_only'
    };
    if (req.body.audience && audienceMapping[req.body.audience]) {
      req.body.audience = audienceMapping[req.body.audience];
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
    
    // Convert stored file paths to frontend access paths
    const announcementsWithCorrectPaths = announcements.map((announcement: any) => {
      if (announcement.banner_image && announcement.banner_image.startsWith('uploads/')) {
        const filename = announcement.banner_image.split('/').pop();
        announcement.banner_image = `/public/images/announcements/${filename}`;
      } else if (announcement.banner_image && announcement.banner_image.startsWith('/public/images/announcements/')) {
        // Already in correct format
        announcement.banner_image = announcement.banner_image;
      } else if (announcement.banner_image && announcement.banner_image.startsWith('public/images/announcements/')) {
        const filename = announcement.banner_image.split('/').pop();
        announcement.banner_image = `/public/images/announcements/${filename}`;
      }
      return announcement;
    });
    
    res.status(200).json(announcementsWithCorrectPaths);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const announcement = await announcementService.getAnnouncementById(
      req.params.id
    );
    if (!announcement) {
      res.status(404).json({ error: "Announcement not found" });
      return;
    }
    
    // Convert stored file paths to frontend access paths
    if (announcement.banner_image && announcement.banner_image.startsWith('uploads/')) {
      const filename = announcement.banner_image.split('/').pop();
      announcement.banner_image = `/public/images/announcements/${filename}`;
    } else if (announcement.banner_image && announcement.banner_image.startsWith('/public/images/announcements/')) {
      // Already in correct format
      announcement.banner_image = announcement.banner_image;
    } else if (announcement.banner_image && announcement.banner_image.startsWith('public/images/announcements/')) {
      const filename = announcement.banner_image.split('/').pop();
      announcement.banner_image = `/public/images/announcements/${filename}`;
    }
    
    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    if (req.file) {
      // Store the file path for database
      req.body.banner_image = `/public/images/announcements/${req.file.filename}`;
    }
    if (req.body.created_by) {
      req.body.posted_by = req.body.created_by;
      delete req.body.created_by;
    }
    if (!req.body.title_slug && req.body.title) {
      req.body.title_slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    
    // Map frontend audience values to backend enum values
    const audienceMapping: { [key: string]: string } = {
      'All Residents': 'all_residents',
      'Specific Zone': 'specific_zone',
      'Staff Only': 'staff_only'
    };
    if (req.body.audience && audienceMapping[req.body.audience]) {
      req.body.audience = audienceMapping[req.body.audience];
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
