import mongoose from 'mongoose';
export default $moduleConfig => {
    return mongoose.connect($moduleConfig.connect);
};
