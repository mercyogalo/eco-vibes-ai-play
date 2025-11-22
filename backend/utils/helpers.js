const generateThumbnailPath = (videoId) => {
  return `/uploads/thumbnails/thumb-${videoId}.jpg`;
};

const calculateEngagementRate = (likes, views) => {
  if (views === 0) return 0;
  return ((likes / views) * 100).toFixed(2);
};

const getViralScore = (video) => {
  const { views, likes, shares, comments } = video;
  
  // Simple viral score calculation
  const engagementRate = calculateEngagementRate(likes, views);
  const shareRatio = views > 0 ? (shares / views) * 100 : 0;
  const commentRatio = views > 0 ? (comments / views) * 100 : 0;

  const viralScore =
    engagementRate * 0.5 + shareRatio * 0.3 + commentRatio * 0.2;

  return Math.min(viralScore, 100);
};

const formatVideoResponse = (video) => {
  return {
    ...video.toObject(),
    engagementRate: calculateEngagementRate(video.likes, video.views),
    viralScore: getViralScore(video),
  };
};

const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";

  return Math.floor(seconds) + " seconds ago";
};

const generateShareMessage = (video) => {
  return `Check out this video: "${video.title}" 🎬 #EcoPulse ${video.hashtags.join(" ")}`;
};

const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  
  return input
    .trim()
    .replace(/[<>]/g, "")
    .substring(0, 500);
};

module.exports = {
  generateThumbnailPath,
  calculateEngagementRate,
  getViralScore,
  formatVideoResponse,
  getTimeAgo,
  generateShareMessage,
  sanitizeInput,
};
