const express = require('express');
const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');



// Middleware to serve static files from the 'images' directory
app.use('/images', express.static('images'));

// Route for version 1
app.get("/cover/v1", async (req, res) => {
  const { id, name } = req.query;

  if (!id || !name) {
    return res.status(400).json({ error: "Please provide both 'id' and 'name' parameters." });
  }

  try {
    const img = `https://www.nguyenmanh.name.vn/api/avtWibu2?id=${id}&tenchinh=${name}&fb=ManhG&tenphu=ManhICT&apikey=APyDXmib`;
    await processImage(img, req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while processing the image." });
  }
});

// Route for version 2
app.get("/cover/v2", async (req, res) => {
  const { id, name } = req.query;

  if (!id || !name) {
    return res.status(400).json({ error: "Please provide both 'id' and 'name' parameters." });
  }

  try {
    const img = `https://www.nguyenmanh.name.vn/api/avtWibu3?id=${id}&tenchinh=${name}&tenphu=ManhICT&apikey=APyDXmib`;
    await processImage(img, req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while processing the image." });
  }
});

// Route for version 3
app.get("/cover/v3", async (req, res) => {
  const { id, name, tenphu } = req.query;

  if (!id || !name || !tenphu) {
    return res.status(400).json({ error: "Please provide 'id', 'name', and 'tenphu' parameters." });
  }

  try {
    const img = `https://www.nguyenmanh.name.vn/api/avtWibu4?id=${id}&tenchinh=${name}&tenphu=${tenphu}&apikey=APyDXmib`;
    await processImage(img, req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while processing the image." });
  }
});

// Route for version 4
app.get("/cover/v4", async (req, res) => {
  const { id, name, tenphu } = req.query;

  if (!id || !name || !tenphu) {
    return res.status(400).json({ error: "Please provide 'id', 'name', and 'tenphu' parameters." });
  }

  try {
    const img = `https://www.nguyenmanh.name.vn/api/avtWibu5?id=${id}&tenchinh=${name}&tenphu=${tenphu}&apikey=APyDXmib`;
    await processImage(img, req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while processing the image." });
  }
});

// Route for version 5
app.get("/cover/v5", async (req, res) => {
  const { id, name } = req.query;

  if (!id || !name) {
    return res.status(400).json({ error: "Please provide both 'id' and 'name' parameters." });
  }

  try {
    const img = `https://www.nguyenmanh.name.vn/api/avtWibu5?id=${id}&tenchinh=${name}&tenphu=ManhICT&apikey=APyDXmib`;
    await processImage(img, req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while processing the image." });
  }
});

async function processImage(img, req, res) {
  const response = await axios.get(img, { responseType: 'stream' });
  const fileName = `cover_${Date.now()}.png`;
  const filePath = `images/${fileName}`;

  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  writer.on('finish', () => {
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    res.json({ imageUrl });

    // Delete the image file after 5 seconds
    setTimeout(() => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
        } else {
          console.log(`Deleted image: ${filePath}`);
        }
      });
    }, 5000); // 5 seconds
  });

  writer.on('error', (err) => {
    console.error('Error writing image:', err);
    return res.status(500).json({ error: "An error occurred while processing the image." });
  });
}

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
