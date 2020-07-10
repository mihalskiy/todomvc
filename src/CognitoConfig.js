const cognitoConfig = {
  Auth: {
    // REQUIRED - Amazon Cognito Identity Pool ID
    identityPoolId: 'us-east-2:e2811872-8286-4e96-95db-5a30ae01c618',
    // REQUIRED - Amazon Cognito Region
    region: 'us-east-2',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'us-east-2_SPrmIsKD5',
    // OPTIONAL - Amazon Cognito Web Client ID
    userPoolWebClientId: '3528ubulv72nvgn9k8d8di730c',
    mandatorySignIn: true,
  },
}

export default cognitoConfig
