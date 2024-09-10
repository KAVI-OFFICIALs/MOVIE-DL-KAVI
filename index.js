const { Client, Buttons, MessageMedia } = require('whatsapp-web.js');
const { searchMovie, getMovieDetails, getDownloadLink } = require('./utils/movieDownloader');
const fs = require('fs');

const client = new Client();

let selectedMovie = ''; // Store selected movie name

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (msg) => {
    if (msg.body.startsWith('.movie')) {
        const movieName = msg.body.split(' ').slice(1).join(' ');

        try {
            const movies = await searchMovie(movieName);

            if (movies.length > 0) {
                let buttons = [];
                movies.forEach((movie, index) => {
                    buttons.push({ body: movie.title });
                });

                let buttonMsg = new Buttons(
                    'Select the movie you want to download:', 
                    buttons, 
                    'Movie Selection', 
                    'Please choose:'
                );
                client.sendMessage(msg.from, buttonMsg);
            } else {
                msg.reply('No movies found with that name.');
            }
        } catch (error) {
            msg.reply('An error occurred while searching for movies.');
        }
    } else if (msg.type === 'buttons_response') {
        if (selectedMovie === '') {
            selectedMovie = msg.body;  // Store selected movie by user

            try {
                const movieDetails = await getMovieDetails(selectedMovie);

                let movieInfo = `*Title:* ${movieDetails.title}\n*Description:* ${movieDetails.description}\n*Category:* ${movieDetails.category}\n*Available Qualities:* ${movieDetails.qualities.join(', ')}`;
                let media = MessageMedia.fromUrl(movieDetails.image);  // Movie image

                await client.sendMessage(msg.from, media, { caption: movieInfo });

                let qualityButtons = movieDetails.qualities.map((quality) => ({ body: quality }));
                let qualityMsg = new Buttons(
                    'Select the movie quality you want:', 
                    qualityButtons, 
                    'Quality Selection', 
                    'Please choose:'
                );
                client.sendMessage(msg.from, qualityMsg);

            } catch (error) {
                msg.reply('Error fetching movie details.');
            }
        } else {
            const selectedQuality = msg.body;

            try {
                let movieLink = await getDownloadLink(selectedMovie, selectedQuality);

                let loadingMsg = await client.sendMessage(msg.from, 'Downloading movie, please wait...');

                // Simulating download progress (replace with actual progress)
                let progress = 0;
                let interval = setInterval(async () => {
                    progress += 10;
                    await client.editMessage(loadingMsg, `Downloading... ${progress}%`);

                    if (progress >= 100) {
                        clearInterval(interval);
                        let movieMedia = MessageMedia.fromFilePath('/path/to/downloaded/movie.mp4');  // Actual movie path
                        await client.sendMessage(msg.from, movieMedia, { caption: 'Here is your movie!' });
                    }
                }, 1000);

            } catch (error) {
                msg.reply('Error occurred while downloading the movie.');
            }
        }
    }
});

client.initialize();
