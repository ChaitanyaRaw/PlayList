const express = require('express');
const fs = require('fs'); // Only reason to import fs to mimic DATABASE

const songs = require('./playlist.json'); // ITS OUR array for play list Storing Area.

// Creating server
const app = express();

// Middleware
app.use(express.json()); // Just to parse the body "req.body"

const port = 9000;

//` Get all songs in our database
app.get('/', (req, res) => {
    // Javascript Code

    //! CHECK
    songs.forEach((playlist) => {
        delete playlist.email;
        delete playlist.emailPassword;
        return playlist;
    });

    res.status(200).json({
        message: 'Here are the songs',
        data: songs,
    });
});

// ` Get a playlist by email and emailPassword
app.get('/my_songs', (req, res) => {
    const { email, emailPassword } = req.body;

    const playlist = songs.filter((playlist) => {
        return (
            playlist.email === email &&
            playlist.emailPassword === emailPassword
        );
    });

    if (!playlist) {
        return res.status(404).json({
            status: 'fail',
            message: 'songs not found',
        });
    }

    res.status(200).json({
        status: 'success',
        data: playlist,
        message: `Here is your playlist ${playlist.length}`,
    });
});

// ` Add a new playlist to our database
app.post('/', (req, res) => {
    const { musicName, email, emailPassword, user_name } =
    req.body;

    if (!musicName ||
        !email ||
        !emailPassword ||
        !user_name
    ) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please fill out all fields',
        });
    }

    // Check if playlist already exists // Basic javascript
    const starExists = songs.find(
        (playlist) => playlist.musicName === musicName
    );

    if (starExists) {
        return res.status(405).json({
            status: 'fail',
            message: 'playlist already exists, Please choose a different musicName',
        });
    }

    const newStar = {
        musicName,
        email,
        emailPassword,
        user_name,
    };

    songs.push(newStar);

    fs.writeFile(
        './songs.json',
        JSON.stringify(songs),
        (err) => {
            if (err) {
                res.status(500).json({
                    message: 'Interval Server Error',
                });
            }
        }
    );

    res.status(201).json({
        message: 'playlist added successfully',
        data: newStar,
    });
});

// ` Update a playlist in our database
app.put('/:musicName', (req, res) => {
    const { musicName } = req.params;

    const starExists = songs.find(
        (playlist) => playlist.musicName === musicName
    );

    if (!starExists) {
        return res.status(404).json({
            status: 'fail',
            message: 'playlist does not exist , Please add a new playlist',
        });
    }

    const { email, emailPassword, newName } =
    req.body;

    if (
        starExists.email !== email ||
        starExists.emailPassword !== emailPassword
    ) {
        return res.status(401).json({
            status: 'fail',
            message: 'You are not authorized to update this playlist',
        });
    }

    starExists.musicName = newName;

    fs.writeFile(
        './songs.json',
        JSON.stringify(songs),
        (err) => {
            if (err) {
                res.status(500).json({
                    message: 'Interval Server Error',
                });
            }
        }
    );

    res.status(200).json({
        data: starExists,
        message: 'playlist updated successfully',
    });
});

// ` Delete a playlist in our database
app.delete('/:musicName', (req, res) => {
    const { musicName } = req.params;

    const starExists = songs.find(
        (playlist) => playlist.musicName === musicName
    );

    if (!starExists) {
        return res.status(404).json({
            status: 'fail',
            message: 'playlist does not exist',
        });
    }

    const { email, emailPassword } = req.body;

    if (
        starExists.email !== email ||
        starExists.emailPassword !== emailPassword
    ) {
        return res.status(401).json({
            status: 'fail',
            message: 'You are not authorized to delete this playlist',
        });
    }

    const index =
        songs.indexOf(starExists);
    songs.splice(index, 1);

    fs.writeFile(
        './songs.json',
        JSON.stringify(songs),
        (err) => {
            if (err) {
                res.status(500).json({
                    message: 'Interval Server Error',
                });
            }
        }
    );

    res.status(200).json({
        message: 'playlist deleted successfully',
    });
});

// Found the playlist
app.put('/found/:musicName', (req, res) => {
    const { musicName } = req.params;

    const starExists = songs.find(
        (playlist) => playlist.musicName === musicName
    );

    if (!starExists) {
        return res.status(404).json({
            status: 'fail',
            message: 'playlist does not exist',
        });
    }

    const {
        secret,
        distance,
        size,
        color,
        constellation,
    } = req.body;

    if (secret !== 'key') {
        return res.status(401).json({
            status: 'fail',
            message: 'You are not authorized to perform this action',
        });
    }

    starExists.found = true;
    starExists.distance = distance;
    starExists.size = size;
    starExists.color = color;
    starExists.constellation =
        constellation;

    fs.writeFile(
        './songs.json',
        JSON.stringify(songs),
        (err) => {
            if (err) {
                res.status(500).json({
                    message: 'Interval Server Error',
                });
            }
        }
    );

    res.status(200).json({
        message: 'playlist found successfully',
        data: starExists,
    });
});

app.listen(port, () => {
    console.log(
        'playlist are twinkling in the night sky @.\n' +
        port
    );
});