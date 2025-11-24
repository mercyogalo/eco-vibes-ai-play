const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ========== MODELS ==========
const Video = require("../models/video");
const Challenge = require("../models/challenge");
const Template = require("../models/template");
const ImpactMetric = require("../models/impactMetric");

// ========== UTILS ==========
const { validateVideoUpload, validateChallenge, validateTemplate, validateImpact } = require("../utils/validator");
const { handleError, AppError } = require("../utils/errorHandler");
const { formatVideoResponse, calculateEngagementRate, getViralScore } = require("../utils/helpers");

// ========== ROUTER INITIALIZATION ==========
const router = express.Router();

// ========== MULTER SETUP ==========
const uploadDirs = ["uploads/videos", "uploads/thumbnails"];
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "video-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|mov|avi|mkv|webm|flv|wmv/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only video files are allowed (mp4, mov, avi, mkv, webm, flv, wmv)"));
    }
  },
});

// ========== TEMPLATES ==========

// GET all templates
router.get("/templates", async (req, res) => {
  try {
    const templates = await Template.find();
    res.json({
      success: true,
      count: templates.length,
      templates: templates,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET templates by category
router.get("/templates/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const templates = await Template.find({ category });

    if (templates.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No templates found for category: ${category}`,
      });
    }

    res.json({
      success: true,
      category,
      count: templates.length,
      templates,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create template
router.post("/templates", async (req, res) => {
  try {
    const {
      name,
      category,
      duration,
      style,
      effects,
      hashtags,
      description,
      script,
      musicSuggestion,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        error: "Name and category are required",
      });
    }

    const template = new Template({
      name,
      category,
      duration,
      style,
      effects: effects || [],
      hashtags: hashtags || [],
      description,
      script,
      musicSuggestion,
    });

    await template.save();

    res.status(201).json({
      success: true,
      message: "Template created successfully",
      template,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== CHALLENGES ==========

// GET all challenges
router.get("/challenges", async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const challenges = await Challenge.find(query);

    res.json({
      success: true,
      count: challenges.length,
      totalParticipants: challenges.reduce((sum, c) => sum + c.participants, 0),
      totalVideos: challenges.reduce((sum, c) => sum + c.videos, 0),
      challenges,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET challenge by ID
router.get("/challenges/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: "Challenge not found",
      });
    }

    res.json({
      success: true,
      challenge,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create challenge
router.post("/challenges", async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      status,
      deadline,
      prize,
      icon,
      difficulty,
      createdBy,
    } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({
        success: false,
        error: "Name, description, and category are required",
      });
    }

    const challenge = new Challenge({
      name,
      description,
      category,
      status: status || "active",
      deadline: deadline ? new Date(deadline) : null,
      prize,
      icon,
      difficulty: difficulty || "medium",
      createdBy,
      participants: 0,
      videos: 0,
    });

    await challenge.save();

    res.status(201).json({
      success: true,
      message: "Challenge created successfully",
      challenge,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST join challenge
router.post("/challenges/:id/join", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, username } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }

    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: "Challenge not found",
      });
    }

    // Check if user already joined. Support legacy string ids and new {userId, username} objects
    const alreadyJoined = challenge.joinedUsers.some((u) => {
      if (!u) return false;
      if (typeof u === "string") return u === userId;
      return u.userId === userId;
    });

    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        error: "You have already joined this challenge",
      });
    }

    challenge.participants += 1;
    // Save username if provided, otherwise store userId only in object
    const userObj = username ? { userId, username } : { userId, username: userId };
    challenge.joinedUsers.push(userObj);
    await challenge.save();

    res.json({
      success: true,
      message: `Successfully joined ${challenge.name}`,
      challenge,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== VIDEOS ==========

// POST upload video
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No video file uploaded",
      });
    }

    const {
      userId,
      title,
      description,
      category,
      hashtags,
      challengeId,
      username,
    } = req.body;

    if (!userId || !title || !category) {
      return res.status(400).json({
        success: false,
        error: "userId, title, and category are required",
      });
    }

    const video = new Video({
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: req.file.path,
      userId,
      username: username || userId,
      title,
      description,
      category,
      hashtags: hashtags ? JSON.parse(hashtags) : [],
      challengeId: challengeId || null,
      status: "ready",
    });

    await video.save();

    // Increment challenge video count if applicable
    if (challengeId) {
      await Challenge.findByIdAndUpdate(challengeId, { $inc: { videos: 1 } });
    }

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      video,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET video by ID
router.get("/video/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        error: "Video not found",
      });
    }

    res.json({
      success: true,
      video,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update video stats
router.put("/video/:id/stats", async (req, res) => {
  try {
    const { id } = req.params;
    const { views, likes, shares, comments } = req.body;

    const video = await Video.findByIdAndUpdate(
      id,
      {
        ...(views !== undefined && { views }),
        ...(likes !== undefined && { likes }),
        ...(shares !== undefined && { shares }),
        ...(comments !== undefined && { comments }),
      },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        error: "Video not found",
      });
    }

    res.json({
      success: true,
      message: "Video stats updated",
      video,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET user videos
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const videos = await Video.find({ userId });

    res.json({
      success: true,
      count: videos.length,
      totalViews: videos.reduce((sum, v) => sum + v.views, 0),
      totalLikes: videos.reduce((sum, v) => sum + v.likes, 0),
      videos,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET trending videos
router.get("/trending", async (req, res) => {
  try {
    const videos = await Video.find({ status: "published" })
      .sort({ views: -1 })
      .limit(10);

    res.json({
      success: true,
      count: videos.length,
      videos,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET videos by category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const videos = await Video.find({ category, status: "published" }).sort({
      views: -1,
    });

    res.json({
      success: true,
      category,
      count: videos.length,
      videos,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT share video
router.put("/video/:id/share", async (req, res) => {
  try {
    const { id } = req.params;
    const { platforms, caption } = req.body;

    if (!platforms || platforms.length === 0) {
      return res.status(400).json({
        success: false,
        error: "At least one platform is required",
      });
    }

    const video = await Video.findByIdAndUpdate(
      id,
      {
        sharedOn: platforms,
        caption,
        status: "published",
      },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        error: "Video not found",
      });
    }

    res.json({
      success: true,
      message: "Video shared successfully",
      video,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== IMPACT METRICS ==========

// POST report impact
router.post("/impact/report", async (req, res) => {
  try {
    const { userId, type, count, username, description, location } = req.body;

    if (!userId || !type) {
      return res.status(400).json({
        success: false,
        error: "userId and type are required",
      });
    }

    const impact = new ImpactMetric({
      userId,
      username: username || userId,
      type,
      count: count || 1,
      description,
      location,
    });

    await impact.save();

    res.status(201).json({
      success: true,
      message: "Impact recorded successfully",
      impact,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET user impact
router.get("/impact/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const impacts = await ImpactMetric.find({ userId });

    const summary = {
      trees_planted: impacts
        .filter((i) => i.type === "tree_planted")
        .reduce((sum, i) => sum + i.count, 0),
      cleanups_attended: impacts
        .filter((i) => i.type === "cleanup_attended")
        .reduce((sum, i) => sum + i.count, 0),
      petitions_signed: impacts
        .filter((i) => i.type === "petition_signed")
        .reduce((sum, i) => sum + i.count, 0),
      videos_created: impacts
        .filter((i) => i.type === "video_created")
        .reduce((sum, i) => sum + i.count, 0),
      challenges_joined: impacts
        .filter((i) => i.type === "challenge_joined")
        .reduce((sum, i) => sum + i.count, 0),
    };

    res.json({
      success: true,
      userId,
      summary,
      allImpacts: impacts,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET platform stats
router.get("/stats/platform", async (req, res) => {
  try {
    const totalVideos = await Video.countDocuments();
    const totalChallenges = await Challenge.countDocuments();
    const totalImpacts = await ImpactMetric.countDocuments();

    const videoStats = await Video.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: "$likes" },
          totalShares: { $sum: "$shares" },
          totalComments: { $sum: "$comments" },
        },
      },
    ]);

    const impactStats = await ImpactMetric.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$count" },
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        totalVideos,
        totalChallenges,
        totalImpacts,
        videoStats: videoStats[0] || {
          totalViews: 0,
          totalLikes: 0,
          totalShares: 0,
          totalComments: 0,
        },
        impactBreakdown: impactStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== ERROR HANDLING ==========
router.use((err, req, res, next) => {
  console.error("Video route error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Something went wrong!",
  });
});

module.exports = router;