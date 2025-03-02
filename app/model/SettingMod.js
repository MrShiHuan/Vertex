const fs = require('fs');
const path = require('path');
const moment = require('moment');
const util = require('../libs/util');
const Cron = require('croner');
const Push = require('../common/Push');
const logger = require('../libs/logger');

const settingPath = path.join(__dirname, '../data/setting.json');
const torrentHistorySettingPath = path.join(__dirname, '../data/setting/torrent-history-setting.json');
const torrentMixSettingPath = path.join(__dirname, '../data/setting/torrent-mix-setting.json');
const sitePushSettingPath = path.join(__dirname, '../data/setting/site-push-setting.json');
const torrentPushSettingPath = path.join(__dirname, '../data/setting/torrent-push-setting.json');

class SettingMod {
  get () {
    const settingStr = fs.readFileSync(settingPath, { encoding: 'utf-8' });
    return JSON.parse(settingStr);
  };

  getBackground () {
    const settingStr = fs.readFileSync(settingPath, { encoding: 'utf-8' });
    return JSON.parse(settingStr).background;
  };

  modify (options) {
    options.apiKey = options.apiKey || util.uuid.v4().replace(/-/g, '').toUpperCase();
    fs.writeFileSync(settingPath, JSON.stringify(options, null, 2));
    global.auth = {
      username: options.username,
      password: options.password
    };
    global.webhookPushTo = options.webhookPushTo;
    global.userAgent = options.userAgent;
    global.apiKey = options.apiKey;
    global.dataPath = options.dataPath || '/';
    global.transparent = options.transparent;
    global.blurSize = options.blurSize;
    global.wechatCover = options.wechatCover;
    global.embyCover = options.embyCover;
    global.plexCover = options.plexCover;
    global.wechatToken = options.wechatToken;
    global.wechatAesKey = options.wechatAesKey;
    global.doubanPush = options.doubanPush;
    global.telegramProxy = options.telegramProxy || 'https://api.telegram.org';
    const webhookPush = util.listPush().filter(item => item.id === global.webhookPushTo)[0];
    if (webhookPush) {
      global.webhookPush = new Push({ ...webhookPush, push: true });
    }
    const doubanPush = util.listPush().filter(item => item.id === global.doubanPush)[0];
    if (doubanPush) {
      global.doubanPush = new Push({ ...doubanPush, push: true });
    }
    return '修改全局设置成功, 部分设定需要刷新页面生效';
  };

  getTorrentHistorySetting () {
    const settingStr = fs.readFileSync(torrentHistorySettingPath, { encoding: 'utf-8' });
    return JSON.parse(settingStr);
  };

  modifyTorrentHistorySetting (options) {
    fs.writeFileSync(torrentHistorySettingPath, JSON.stringify(options, null, 2));
    return '修改成功';
  };

  getTorrentMixSetting () {
    const settingStr = fs.readFileSync(torrentMixSettingPath, { encoding: 'utf-8' });
    return JSON.parse(settingStr);
  };

  modifyTorrentMixSetting (options) {
    fs.writeFileSync(torrentMixSettingPath, JSON.stringify(options, null, 2));
    return '修改成功';
  };

  getTorrentPushSetting () {
    const settingStr = fs.readFileSync(torrentPushSettingPath, { encoding: 'utf-8' });
    return JSON.parse(settingStr);
  };

  modifyTorrentPushSetting (options) {
    fs.writeFileSync(torrentPushSettingPath, JSON.stringify(options, null, 2));
    return '修改成功';
  };

  getSitePushSetting () {
    const settingStr = fs.readFileSync(sitePushSettingPath, { encoding: 'utf-8' });
    return JSON.parse(settingStr);
  };

  modifySitePushSetting (options) {
    fs.writeFileSync(sitePushSettingPath, JSON.stringify(options, null, 2));
    if (global.sitePushJob) global.sitePushJob.stop();
    global.sitePushJob = Cron(options.cron, () => {
      const pushTo = util.listPush().filter(item => item.id === options.pushTo)[0] || {};
      pushTo.push = true;
      const push = new Push(pushTo);
      push.pushSiteData();
    });
    return '修改成功';
  };

  async getRunInfo () {
    const { uploaded, downloaded } = (await util.getRecord('select sum(upload) as uploaded, sum(download) as downloaded from torrents'));
    const addCountToday = (await util.getRecord('select count(*) as addCount from torrents where record_type = 1 and record_time > ?', [moment().startOf('day').unix()])).addCount;
    const rejectCountToday = (await util.getRecord('select count(*) as rejectCount from torrents where record_type = 2 and record_time > ?', [moment().startOf('day').unix()])).rejectCount;
    const deleteCountToday = (await util.getRecord('select count(*) as deleteCount from torrents where delete_time is not null and record_time > ?', [moment().startOf('day').unix()])).deleteCount;
    const addCount = (await util.getRecord('select count(*) as addCount from torrents where record_type = 1')).addCount;
    const rejectCount = (await util.getRecord('select count(*) as rejectCount from torrents where record_type = 2')).rejectCount;
    const deleteCount = (await util.getRecord('select count(*) as deleteCount from torrents where delete_time is not null')).deleteCount;
    const perTracker = (await util.getRecords('select sum(upload) as uploaded, sum(download) as downloaded, tracker from torrents where tracker is not null group by tracker'));
    const perTrackerTodaySet = {};
    let uploadedToday = 0;
    let downloadedToday = 0;
    const torrents = await util.getRecords('select hash, max(upload) - min(upload) as upload,  max(download) - min(download) as download from torrent_flow where time >= ? group by hash', [moment().startOf('day').unix()]);
    for (const torrent of torrents) {
      uploadedToday += torrent.upload;
      downloadedToday += torrent.download;
      const _torrent = await util.getRecord('select tracker from torrents where hash = ? and tracker is not null', [torrent.hash]);
      if (!_torrent) {
        continue;
      }
      if (!perTrackerTodaySet[_torrent.tracker]) {
        perTrackerTodaySet[_torrent.tracker] = { uploaded: 0, downloaded: 0 };
      }
      perTrackerTodaySet[_torrent.tracker].uploaded += torrent.upload;
      perTrackerTodaySet[_torrent.tracker].downloaded += torrent.download;
    }
    const perTrackerToday = [];
    for (const tracker of Object.keys(perTrackerTodaySet)) {
      perTrackerToday.push({ tracker, ...perTrackerTodaySet[tracker] });
    }
    return {
      uploaded: uploaded || 0,
      downloaded: downloaded || 0,
      uploadedToday: uploadedToday || 0,
      downloadedToday: downloadedToday || 0,
      addCount,
      rejectCount,
      deleteCount,
      addCountToday,
      rejectCountToday,
      deleteCountToday,
      startTime: global.startTime,
      perTracker,
      perTrackerToday
    };
  };

  async backupVertex () {
    const backupsFile = `/tmp/Vertex-backups-${moment().format('YYYY-MM-DD_HH:mm:ss')}.tar.gz`;
    await util.tar.c({
      gzip: true,
      file: backupsFile,
      cwd: global.dataPath
    }, ['vertex/db', 'vertex/data', 'vertex/config', 'vertex/torrents']);
    return backupsFile;
  }

  async restoreVertex (options) {
    const backupsFile = options.file.path || options.file.originalFilename;
    await util.tar.x({
      gzip: true,
      file: backupsFile,
      C: '/tmp'
    });
    return '数据导入成功, 重启容器后生效。';
  }

  async getTrackerFlowHistory () {
    const _timeGroup = await util.getRecords('select time from tracker_flow where time >= ? group by time', [moment().unix() - 24 * 3600]);
    const timeGroup = _timeGroup.map(i => i.time);
    const res = await util.getRecords('select * from tracker_flow where time >= ?', [moment().unix() - 24 * 3600]);
    const trackers = {};
    for (const item of res) {
      if (!item.tracker) continue;
      if (!trackers[item.tracker]) trackers[item.tracker] = {};
      trackers[item.tracker][item.time] = item;
    }
    for (const _tracker of Object.keys(trackers)) {
      const tracker = trackers[_tracker];
      for (const [index, time] of timeGroup.entries()) {
        const _t = tracker[time] || tracker[timeGroup[index - 1]] || { download: 0, upload: 0 };
        tracker[time] = { download: +(_t.download / 300).toFixed(2), upload: +(_t.upload / 300).toFixed(2) };
      }
    }
    return {
      trackers,
      timeGroup
    };
  }
}

module.exports = SettingMod;
