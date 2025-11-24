const axios = require("axios");

const TIKTOK_CLIENT_ID = process.env.TIKTOK_CLIENT_ID;
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
const TIKTOK_REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI || "http://localhost:5000/api/tiktok/callback";

// Generate TikTok OAuth URL for user to login
const generateTikTokAuthUrl = () => {
  const scope = "user.info.basic,video.upload"; // Scopes we need
  const state = Math.random().toString(36).substring(7);
  
  const authUrl = `https://www.tiktok.com/v1/oauth/authorize?` +
    `client_key=${TIKTOK_CLIENT_ID}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&redirect_uri=${encodeURIComponent(TIKTOK_REDIRECT_URI)}` +
    `&response_type=code` +
    `&state=${state}`;
  
  return authUrl;
};

// Exchange authorization code for access token
const getTikTokAccessToken = async (code) => {
  try {
    const response = await axios.post(
      "https://open.tiktok.com/v1/oauth/token/",
      {
        client_key: TIKTOK_CLIENT_ID,
        client_secret: TIKTOK_CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
      }
    );

    return {
      success: true,
      accessToken: response.data.data.access_token,
      refreshToken: response.data.data.refresh_token,
      expiresIn: response.data.data.expires_in,
      openId: response.data.data.open_id,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

// Refresh expired access token
const refreshTikTokToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      "https://open.tiktok.com/v1/oauth/token/",
      {
        client_key: TIKTOK_CLIENT_ID,
        client_secret: TIKTOK_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }
    );

    return {
      success: true,
      accessToken: response.data.data.access_token,
      refreshToken: response.data.data.refresh_token,
      expiresIn: response.data.data.expires_in,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get TikTok user info
const getTikTokUserInfo = async (accessToken, openId) => {
  try {
    const response = await axios.get(
      `https://open.tiktok.com/v1/user/info/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          fields: "open_id,union_id,display_name,avatar_large_url,is_verified",
          open_id: openId,
        },
      }
    );

    return {
      success: true,
      user: response.data.data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Upload video to TikTok
const uploadVideoToTikTok = async (accessToken, openId, videoFilePath, caption) => {
  try {
    // Step 1: Initialize upload
    const initResponse = await axios.post(
      `https://open.tiktok.com/v1/video/upload/init/`,
      {
        source_info: {
          source: "FILE_UPLOAD",
          chunk_size: 5242880, // 5MB
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          open_id: openId,
        },
      }
    );

    const uploadToken = initResponse.data.data.upload_token;

    // Step 2: Upload video chunks (simplified - uploads entire file)
    const fs = require("fs");
    const videoBuffer = fs.readFileSync(videoFilePath);

    await axios.post(
      `https://open.tiktok.com/v1/video/upload/`,
      videoBuffer,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "video/mp4",
          "Content-Range": `bytes 0-${videoBuffer.length - 1}/${videoBuffer.length}`,
        },
        params: {
          upload_token: uploadToken,
          open_id: openId,
        },
      }
    );

    // Step 3: Publish video
    const publishResponse = await axios.post(
      `https://open.tiktok.com/v1/video/publish/`,
      {
        source_info: {
          source: "FILE_UPLOAD",
          video_upload_token: uploadToken,
        },
        post_info: {
          caption: caption,
          privacy_level: "PUBLIC_TO_EVERYONE",
          disable_comment: false,
          disable_duet: false,
          disable_stitch: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          open_id: openId,
        },
      }
    );

    return {
      success: true,
      videoId: publishResponse.data.data.video_id,
      message: "Video uploaded to TikTok successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

module.exports = {
  generateTikTokAuthUrl,
  getTikTokAccessToken,
  refreshTikTokToken,
  getTikTokUserInfo,
  uploadVideoToTikTok,
};
