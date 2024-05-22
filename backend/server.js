import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

// Schema and Model
const librarySchema = new mongoose.Schema({
    videoId: { type: String, required: true, unique: true },
    lyrics: String,
    songName: String,
    artistName: String,
    mainBoxContent: Array,
    trackUri: String
});

const Library = mongoose.model('Library', librarySchema);

// Routes
app.get('/library', async (req, res) => {
    const library = await Library.find();
    res.json(library);
});

app.post('/library', async (req, res) => {
    const { videoId, lyrics, songName, artistName, mainBoxContent, trackUri } = req.body;
    const newEntry = new Library({ videoId, lyrics, songName, artistName, mainBoxContent, trackUri });
    try {
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/library/:videoId', async (req, res) => {
    const { videoId } = req.params;
    try {
        await Library.findOneAndDelete({ videoId });
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
