const requestOptions = (verb, path, body, token ) => ({
  method: verb,
  url: path,
  baseURL: process.env.API_BASE_URL,
  headers: {
    authorization: token,
  },
  data: body,
});

export default requestOptions;
