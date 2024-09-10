async function downloadMovie(client, movieName, quality, msg) {
    try {
        await msg.reply('*🚀 Starting the movie download...*');

        const downloadLink = await getDownloadLink(movieName, quality);

        // Simulate downloading and sending the movie
        let moviePath = '/path/to/downloaded/movie.mp4';  // Path where the movie is saved after downloading
        let movieTitle = movieName + '.mp4';

        await msg.reply('*📥 Downloading the movie...*');
        const movieMedia = MessageMedia.fromFilePath(moviePath);

        await msg.reply('*📤 Uploading the movie...*');
        // Send movie as document with title
        await client.sendMessage(msg.from, movieMedia, { sendMediaAsDocument: true, caption: movieTitle });
        
        await msg.reply('*✅ Success! Movie sent.*');

    } catch (error) {
        msg.reply('*❌ Error occurred while downloading the movie.*');
    }
}
