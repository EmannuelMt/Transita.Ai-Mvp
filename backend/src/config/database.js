require('dotenv').config();

const connectDB = async () => {
    if (process.env.NODE_ENV !== 'test') console.log('Using Firebase Realtime Database as primary data store');
    return null;
};

const disconnectDB = async () => {
    if (process.env.NODE_ENV !== 'test') console.log('No MongoDB configured');
    return null;
};

module.exports = { connectDB, disconnectDB };