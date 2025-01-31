const logger = require('../libs/logger');
const TorrentMod = require('../model/TorrentMod');

const torrentMod = new TorrentMod();

class Torrent {
  async list (req, res) {
    const options = req.query;
    try {
      const r = await torrentMod.list(options);
      res.send({
        success: true,
        data: r
      });
    } catch (e) {
      logger.error(e);
      res.send({
        success: false,
        message: e.message
      });
    }
  };

  async info (req, res) {
    const options = req.query;
    try {
      const r = torrentMod.info(options);
      res.send({
        success: true,
        data: r
      });
    } catch (e) {
      logger.error(e);
      res.send({
        success: false,
        message: e.message
      });
    }
  };

  async listHistory (req, res) {
    const options = req.query;
    try {
      const r = await torrentMod.listHistory(options);
      res.send({
        success: true,
        data: r
      });
    } catch (e) {
      logger.error(e);
      res.send({
        success: false,
        message: e.message
      });
    }
  };

  async link (req, res) {
    const options = req.body;
    try {
      const r = await torrentMod.link(options);
      res.send({
        success: true,
        message: r
      });
    } catch (e) {
      logger.error(e);
      res.send({
        success: false,
        message: e.message
      });
    }
  };
}
module.exports = Torrent;
