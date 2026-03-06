export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_TEMPLATE, // PASTE YOUR ISSUER URL HERE
      applicationID: "convex",
    },
  ],
};
