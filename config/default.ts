export default {
  port: 1337,
  saltWorkFactor: 10,
  origin: 'http://localhost:3000',
  dbURI: 'mongodb://localhost:27017/typescript-api',
  accessTokenTtl: '15m',
  refreshTokenTtl: '1y',
  publicKey: `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGgwpLKPBXUUVXhYhuxVnRHdEBwW
pUfagS5HA3eNG7ELZdHfdwzCH06XgJ8vaai+LaJ1I4n6Z+3036Xb83nlzrkxyVS7
8nLow0mFCzotomqOd16qZlH9tyPVF14uGSGWIZjKPHy/o7HQf8hRQz5ffPCQG4dm
bb3H3q1KMsF6N3W9AgMBAAE=
-----END PUBLIC KEY-----`,
  privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgGgwpLKPBXUUVXhYhuxVnRHdEBwWpUfagS5HA3eNG7ELZdHfdwzC
H06XgJ8vaai+LaJ1I4n6Z+3036Xb83nlzrkxyVS78nLow0mFCzotomqOd16qZlH9
tyPVF14uGSGWIZjKPHy/o7HQf8hRQz5ffPCQG4dmbb3H3q1KMsF6N3W9AgMBAAEC
gYBI3wTCMk/h1Ef3NQuhDjweO1xCGQCeoc/KGzbsjc/5Yvxi7oWocblN0Z7PN20R
7Xmjb4Rcw7ue7a7ipVTERBvx9mGtmUnFkgv5EpI5/B5pwpY93z+wRXfN/Kkgipm0
3WtPXrja0K/Uz7L2F16DxFskxDwpYutknoVPwFl1cOBYrQJBAM70GBDVP9HHqMPE
T9pm0QpEUos1UE01Ba233jvRd4SMUzgNK1Wx2ypnzVvvnUkkSv0aYGtzL4ZMnVzy
z0wDDksCQQCA4d7RcSBTPfuWJd2g4979Ajnqida9ajBnK4IA0mj69Q5KWtPr2S2J
koLOYnZXIgN3nyHE5Q5U/t+XJQFO82cXAkA7Tb9Hs5QiLTCzSKIJV8U3R/TPZ2un
dDY4XaQVSCUTmpKOUVfFqr2/HRe/7J4Jw5iphtFyeQN5XKMLa5jzkzyZAkAyyU7F
V3+2balTHG6+NK0tJBBwdIqTL2INdZ6P9ln58lEESdBSks0X9gzniPM7GKMnIyTq
cpx4L8spwyJF2zJXAkEAmH9TVXRRzUCndKG9x/xMfirAPyZ4Uy8g5S7O1ZSrdMQd
lkRIH60CBKWYgVuD2/ih7fvG/tTGV0qVIvbeVo7gzg==
-----END RSA PRIVATE KEY-----`,
  googleClientId: `${process.env.GOOGLE_CLIENT_ID}`,
  googleClientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
  googleRedirectUrl: `${process.env.GOOGLE_REDIRECT_URL}`,
};
