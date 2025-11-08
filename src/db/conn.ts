import mongoose from 'mongoose';


export default async function connectToDB(address: string) {
    try {
        console.log(`Attempting to connect to mongodb://${address}/titanrooms`)
        await mongoose.connect(`mongodb://${address}/titanrooms`);
        console.log(`connected to MongoDB at ${address}`);
    } catch (error) {
        console.log(`Attempted to connect to mongodb://${address}/titanrooms\n`)
        console.error('Error connecting to MongoDB:', error);
    }
}
