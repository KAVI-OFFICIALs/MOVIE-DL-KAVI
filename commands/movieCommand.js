async function handleMovieCommand(client, msg) {
    const senderNumber = msg.from.split('@')[0];  // Extract the sender's number

    // Check if the number is allowed
    if (!allowedNumbers.includes(senderNumber)) {
        return msg.reply('*❌ Please contact the owner for movie download access.*');
    }

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
                    '*🎬 Select the movie you want to download:*',
                    buttons,
                    'Movie Selection',
                    'Please choose:'
                );
                client.sendMessage(msg.from, buttonMsg);
            } else {
                msg.reply('*❌ No movies found with that name.*');
            }
        } catch (error) {
            msg.reply('*❌ An error occurred while searching for movies.*');
        }
    }
}
