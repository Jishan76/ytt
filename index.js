const express = require('express');
const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');
const app = express();
const PORT = process.env.PORT || 3000;

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

    const audioTitle = videoInfo.videoDetails.title;

    // Set headers for file download
    res.set({
      'Content-Disposition': `attachment; filename="${audioTitle}.mp3"`,
      'Content-Type': 'audio/mpeg',
    });

    // Pipe the audio stream to response for download
    ytdl(firstVideo.url, { format: audioFormat })
      .pipe(res);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
