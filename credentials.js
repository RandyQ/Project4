// Credentials for database and session
module.exports = {
    mongo: {
        development: {
            connectionString: 'mongodb+srv://RandyQ:Doomest5@cluster0-90fbj.mongodb.net/Project4?retryWrites=true&w=majority'
        },
        production: {
            connectionString: 'mongodb+srv://RandyQ:Doomest5@cluster0-90fbj.mongodb.net/Project4?retryWrites=true&w=majority'
        }
    },
    session: {
        secret: 'rcq1',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } 
    }
};