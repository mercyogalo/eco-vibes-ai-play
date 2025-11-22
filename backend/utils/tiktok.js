const tiktokApi = {
  async postVideo(accessToken, videoUrl, caption) {
    try {
      const response = await fetch(
        "https://open.tiktokapis.com/v1/video/upload/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            video: {
              source: videoUrl,
            },
            caption: caption,
            privacy_level: "PUBLIC_TO_ANYONE",
          }),
        }
      );

      const data = await response.json();
      return {
        success: true,
        platform: "tiktok",
        postId: data.data?.video_id,
        url: `https://tiktok.com/@ecopulse/video/${data.data?.video_id}`,
      };
    } catch (error) {
      return {
        success: false,
        platform: "tiktok",
        error: error.message,
      };
    }
  },
};