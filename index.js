const express = require('express');
const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/video', async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).send('Missing query parameter');
  }

  try {
    // Search for videos using yt-search
    const { videos } = await ytSearch(query);

    if (!videos.length) {
      return res.status(404).send('No videos found');
    }

    // Get the first video
    const firstVideo = videos[0];

    // Get video details
    const videoInfo = await ytdl.getInfo(firstVideo.url);

    // Get the highest quality video format
    const videoFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highestvideo' });
    if (!videoFormat) {
      return res.status(404).send('No video found');
    }

    const videoUrl = videoFormat.url;

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(firstVideo.title)}.mp4"`);
    res.setHeader('Content-Type', 'video/mp4');

    // Redirect the user to the direct video URL
    axios.get(videoUrl, { responseType: 'stream' })
      .then(response => {
        response.data.pipe(res);
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/audio', async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).send('Missing query parameter');
  }

  try {
    // Search for videos using yt-search
    const { videos } = await ytSearch(query);

    if (!videos.length) {
      return res.status(404).send('No videos found');
    }

    // Get the first video
    const firstVideo = videos[0];

    // Get video details
    const videoInfo = await ytdl.getInfo(firstVideo.url);

    // Get the highest quality audio format
    const audioFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highestaudio' });
    if (!audioFormat) {
      return res.status(404).send('No audio found');
    }

    const audioUrl = audioFormat.url;

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(firstVideo.title)}.mp3"`);
    res.setHeader('Content-Type', 'audio/mp3');

    // Redirect the user to the direct audio URL
    axios.get(audioUrl, { responseType: 'stream' })
      .then(response => {
        response.data.pipe(res);
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
