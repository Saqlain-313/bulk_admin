import ImportUser from "../models/ImportUser.js";
import mongoose from "mongoose";



// ✅ GET ALL + DUPLICATE + UNIQUE ANALYSIS
import User from "../models/User.js";

export const getImportUsersAnalysis = async (req, res) => {
  try {
    const users = await ImportUser.find().lean();

    // ✅ 1. Collect all uploadedBy IDs
    const userIds = [
      ...new Set(users.map(u => u.uploadedBy).filter(Boolean))
    ];

    // ✅ 2. Find users by those IDs
    const dbUsers = await User.find({
      _id: { $in: userIds }
    })
      .select("name")
      .lean();

    // ✅ 3. Create map: id → name
    const userMap = {};
    dbUsers.forEach(u => {
      userMap[u._id.toString()] = u.name;
    });



    // ✅ 4. Attach name to each import user
    const usersWithName = users.map(u => ({
      ...u,
      uploadedByName: userMap[u.name?.toString()] || "Unknown",
    }));

    // 🔍 DUPLICATE LOGIC (same as yours)
    const mobileMap = {};
    const duplicates = [];
    const unique = [];

    usersWithName.forEach((user) => {
      if (mobileMap[user.mobile]) {
        mobileMap[user.mobile].push(user);
      } else {
        mobileMap[user.mobile] = [user];
      }
    });

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
      all: usersWithName, // ✅ important
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

    // ✅ filter valid ObjectIds
    const validIds = ids.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validIds.length === 0) {
      return res.status(400).json({ message: "No valid IDs provided" });
    }

    await ImportUser.updateMany(
      { _id: { $in: validIds } },
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