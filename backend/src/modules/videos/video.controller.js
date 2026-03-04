const videoService = require('./video.service');

class VideoController {
  async getVideo(req, res, next) {
    try {
      const { videoId } = req.params;
      const userId = req.user.userId;
      const video = await videoService.getVideoById(videoId, userId);
      res.json(video);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VideoController();
