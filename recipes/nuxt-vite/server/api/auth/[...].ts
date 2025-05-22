const config = {
    baseUrl: process.env.ASGARDEO_BASE_URL as string,
    clientID: process.env.ASGARDEO_CLIENT_ID as string,
    clientSecret: process.env.ASGARDEO_CLIENT_SECRET as string,
    signInRedirectURL: process.env.ASGARDEO_SIGN_IN_REDIRECT_URL as string,
    signOutRedirectURL: process.env.ASGARDEO_SIGN_OUT_REDIRECT_URL as string,
    scope: process.env.ASGARDEO_SCOPE?.split(",").map(scope => scope.trim()) as string[]
}

export default AsgardeoAuthHandler(config);
