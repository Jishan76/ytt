const express = require('express');
const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/video', async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
    // Search for videos using yt-search
    const { videos } = await ytSearch(query);

    if (!videos.length) {
      return res.status(404).json({ error: 'No videos found' });
    }

    // Get the first video
    const firstVideo = videos[0];

    // Get video details
    const videoInfo = await ytdl.getInfo(firstVideo.url);

    // Get the highest quality video format
    const videoFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highestvideo' });
    if (!videoFormat) {
      return res.status(404).json({ error: 'No video found' });
    }

    const videoUrl = videoFormat.url;
    const videoTitle = videoInfo.videoDetails.title;

    const responseJson = {
      title: videoTitle,
      url: videoUrl
    };

    res.json(responseJson);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/audio', async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
    // Search for videos using yt-search
    const { videos } = await ytSearch(query);

    if (!videos.length) {
      return res.status(404).json({ error: 'No videos found' });
    }

    // Get the first video
    const firstVideo = videos[0];

    // Get video details
    const videoInfo = await ytdl.getInfo(firstVideo.url);

    // Get the highest quality audio format
    const audioFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highestaudio' });
    if (!audioFormat) {
      return res.status(404).json({ error: 'No audio found' });
    }

    const audioUrl = audioFormat.url;
    const audioTitle = videoInfo.videoDetails.title;

    const responseJson = {
      title: audioTitle,
      url: audioUrl
    };

    res.json(responseJson);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
