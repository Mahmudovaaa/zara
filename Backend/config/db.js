import mongoose from 'mongoose';

const connection = `mongoose.connect(process.env.mongo_url)`;

export { connection };
