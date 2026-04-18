import ImportUser from "../models/ImportUser.js";


// ✅ GET ALL + DUPLICATE + UNIQUE ANALYSIS
export const getImportUsersAnalysis = async (req, res) => {
  try {
    const users = await ImportUser.find().lean();

    const mobileMap = {};
    const duplicates = [];
    const unique = [];

    // 🔍 GROUP BY MOBILE
    users.forEach((user) => {
      if (mobileMap[user.mobile]) {
        mobileMap[user.mobile].push(user);
      } else {
        mobileMap[user.mobile] = [user];
      }
    });

    // 🎯 SPLIT DUPLICATE & UNIQUE
    Object.values(mobileMap).forEach((group) => {
      if (group.length > 1) {
        duplicates.push(...group);
      } else {
        unique.push(group[0]);
      }
    });

    res.json({
      total: users.length,
      uniqueCount: unique.length,
      duplicateCount: duplicates.length,
      unique,
      duplicates,
      all: users,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateImportUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, errorMessage } = req.body;

    const user = await ImportUser.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status || user.status;
    user.errorMessage = errorMessage || null;

    if (status === "sent") {
      user.sentAt = new Date();
    }

    await user.save();

    res.json({ message: "Status updated", user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;

    await ImportUser.updateMany(
      { _id: { $in: ids } },
      {
        status,
        ...(status === "sent" && { sentAt: new Date() }),
      }
    );

    res.json({ message: "Bulk update successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};