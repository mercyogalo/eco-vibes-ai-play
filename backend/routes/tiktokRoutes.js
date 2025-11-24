const express = require("express");
const router = express.Router();
const TikTokAccount = require("../models/tiktokAccount");
const Video = require("../models/video");
const {
  generateTikTokAuthUrl,
  getTikTokAccessToken,
  refreshTikTokToken,
  getTikTokUserInfo,
  uploadVideoToTikTok,
} = require("../utils/tiktokAuth");
const { handleError, AppError } = require("../utils/errorHandler");

// ========== 1. GET TIKTOK LOGIN URL ==========
router.get("/auth-url", async (req, res) => {
  try {
    const authUrl = generateTikTokAuthUrl();
    res.json({
      success: true,
      authUrl,
      message: "Redirect user to this URL to login with TikTok",
    });
  } catch (error) {
    handleError(res, error);
  }
});

// ========== 2. TIKTOK OAUTH CALLBACK ==========
router.get("/callback", async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;

    // Check for OAuth errors
    if (error) {
      return res.json({
        success: false,
        error: error_description || error,
      });
    }

    if (!code) {
      throw new AppError("No authorization code provided", 400);
    }

    // Exchange code for access token
    const tokenResponse = await getTikTokAccessToken(code);

    if (!tokenResponse.success) {
      throw new AppError(tokenResponse.error, 400);
    }

    const { accessToken, refreshToken, expiresIn, openId } = tokenResponse;

    // Get user info
    const userResponse = await getTikTokUserInfo(accessToken, openId);

    if (!userResponse.success) {
      throw new AppError("Failed to fetch user info", 400);
    }

    const user = userResponse.user;

    // Save or update TikTok account
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    const tiktokAccount = await TikTokAccount.findOneAndUpdate(
      { tiktokOpenId: openId },
      {
        tiktokOpenId: openId,
        tiktokUnionId: user.union_id,
        displayName: user.display_name,
        avatarUrl: user.avatar_large_url,
        isVerified: user.is_verified,
        accessToken,
        refreshToken,
        expiresAt,
        isConnected: true,
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "TikTok account connected successfully",
      tiktokAccount,
      redirectUrl: `http://localhost:3000/dashboard?tiktok=connected&openId=${openId}`,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// ========== 3. GET TIKTOK ACCOUNT STATUS ==========
router.get("/account/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const account = await TikTokAccount.findOne({ userId });

    if (!account) {
      return res.json({
        success: true,
        connected: false,
        message: "TikTok account not connected",
      });
    }

    // Check if token expired
    if (account.expiresAt < new Date()) {
      // Token expired, try to refresh
      const refreshResponse = await refreshTikTokToken(account.refreshToken);

      if (refreshResponse.success) {
        account.accessToken = refreshResponse.accessToken;
        account.refreshToken = refreshResponse.refreshToken;
        account.expiresAt = new Date(Date.now() + refreshResponse.expiresIn * 1000);
        await account.save();
      } else {
        account.isConnected = false;
        await account.save();
        return res.json({
          success: true,
          connected: false,
          message: "Token expired and refresh failed. Please reconnect.",
        });
      }
    }

    res.json({
      success: true,
      connected: account.isConnected,
      account: {
        displayName: account.displayName,
        avatarUrl: account.avatarUrl,
        isVerified: account.isVerified,
        connectedAt: account.connectedAt,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

// ========== 4. DISCONNECT TIKTOK ACCOUNT ==========
router.post("/disconnect/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    await TikTokAccount.findOneAndDelete({ userId });

    res.json({
      success: true,
      message: "TikTok account disconnected",
    });
  } catch (error) {
    handleError(res, error);
  }
});

// ========== 5. UPLOAD VIDEO TO TIKTOK ==========
router.post("/upload-video/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      throw new AppError("userId is required", 400);
    }

    // Get video from database
    const video = await Video.findById(videoId);

    if (!video) {
      throw new AppError("Video not found", 404);
    }

    // Get TikTok account
    const tiktokAccount = await TikTokAccount.findOne({ userId });

    if (!tiktokAccount || !tiktokAccount.isConnected) {
      throw new AppError("TikTok account not connected. Please login first.", 400);
    }

    // Check if token expired and refresh if needed
    if (tiktokAccount.expiresAt < new Date()) {
      const refreshResponse = await refreshTikTokToken(tiktokAccount.refreshToken);

      if (!refreshResponse.success) {
        tiktokAccount.isConnected = false;
        await tiktokAccount.save();
        throw new AppError("Token expired. Please reconnect TikTok account.", 401);
      }

      tiktokAccount.accessToken = refreshResponse.accessToken;
      tiktokAccount.refreshToken = refreshResponse.refreshToken;
      tiktokAccount.expiresAt = new Date(Date.now() + refreshResponse.expiresIn * 1000);
      await tiktokAccount.save();
    }

    // Upload to TikTok
    const caption = video.caption || `${video.title} #EcoPulse ${video.hashtags.join(" ")}`;

    const uploadResponse = await uploadVideoToTikTok(
      tiktokAccount.accessToken,
      tiktokAccount.tiktokOpenId,
      video.path,
      caption
    );

    if (!uploadResponse.success) {
      throw new AppError(uploadResponse.error, 400);
    }

    // Update video with TikTok info
    video.sharedOn = video.sharedOn || [];
    if (!video.sharedOn.includes("tiktok")) {
      video.sharedOn.push("tiktok");
    }
    video.tiktokVideoId = uploadResponse.videoId;
    await video.save();

    res.json({
      success: true,
      message: "Video uploaded to TikTok successfully",
      videoId: uploadResponse.videoId,
      tiktokUrl: `https://www.tiktok.com/@${tiktokAccount.displayName}/video/${uploadResponse.videoId}`,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// ========== 6. GET TIKTOK SHARE STATUS ==========
router.get("/video-status/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
      throw new AppError("Video not found", 404);
    }

    res.json({
      success: true,
      sharedOnTikTok: video.sharedOn?.includes("tiktok") || false,
      tiktokVideoId: video.tiktokVideoId || null,
      tiktokUrl: video.tiktokVideoId
        ? `https://www.tiktok.com/video/${video.tiktokVideoId}`
        : null,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// ========== ERROR HANDLING ==========
router.use((err, req, res, next) => {
  console.error("TikTok route error:", err);
  handleError(res, err);
});

module.exports = router;