
module.exports = {
  promise: () => {
    // Catch all uncaught promises for easier debugging
    process.on('unhandledRejection', (reason, promise) => {
      console.log('Unhandled Rejection at: Promise', promise, 'reason:', reason);
    });
  }
};
