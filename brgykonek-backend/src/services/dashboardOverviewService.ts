import Complaint from "../models/Complaint";
import Announcement from "../models/Announcement";
import User from "../models/User";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const getOverviewStatistics = async (
  year = new Date().getFullYear()
) => {
  const [totalComplaints, totalActiveAnnouncements, totalResidents] =
    await Promise.all([
      Complaint.countDocuments(),
      Announcement.countDocuments({ status: "published" }),
      User.countDocuments({ user_type: "resident" }),
    ]);

  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);

  const complaintsPerMonthRaw = await Complaint.aggregate([
    { $match: { created_at: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: { month: { $month: "$created_at" } },
        count: { $sum: 1 },
      },
    },
    { $project: { month: "$_id.month", count: 1, _id: 0 } },
    { $sort: { month: 1 } },
  ]);

  const announcementsPerMonthRaw = await Announcement.aggregate([
    { $match: { status: "published", created_at: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: { month: { $month: "$created_at" } },
        count: { $sum: 1 },
      },
    },
    { $project: { month: "$_id.month", count: 1, _id: 0 } },
    { $sort: { month: 1 } },
  ]);

  const usersPerMonthRaw = await User.aggregate([
    { $match: { user_type: "resident", createdAt: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $project: { month: "$_id.month", count: 1, _id: 0 } },
    { $sort: { month: 1 } },
  ]);

  const complaintsPerMonth = complaintsPerMonthRaw.map((item) => ({
    month: MONTHS[item.month - 1],
    count: item.count,
  }));

  const announcementsPerMonth = announcementsPerMonthRaw.map((item) => ({
    month: MONTHS[item.month - 1],
    count: item.count,
  }));

  const usersPerMonth = usersPerMonthRaw.map((item) => ({
    month: MONTHS[item.month - 1],
    count: item.count,
  }));

  return {
    totalComplaints,
    totalActiveAnnouncements,
    totalResidents,
    complaintsPerMonth,
    announcementsPerMonth,
    usersPerMonth,
  };
};
