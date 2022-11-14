const authConfig = {
  secret: process.env.DEMO_CREDIT_APP_SECRET,
  tokenExpiryTime: 360, // seconds => 5 minutes
  jwtHashName: process.env.JWT_HASH_NAME,
  payStackSecretKey: process.env.PAYSTACK_SECRET,
  redisServerPort: process.env.DEMO_CREDIT_REDIS_PORT || 6379,
  redisServerURL: process.env.DEMO_CREDIT_REDIS_URL,
  redisConnectionString: process.env.REDIS_URL
};

export { authConfig };
