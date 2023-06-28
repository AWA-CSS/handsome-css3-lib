import { LS_ACCESS_TOKEN_KEY, LS_USER_KEY } from './constants';
import { Query, http } from './uitls';

const oauthUri = 'https://github.com/login/oauth/authorize';
const redirect_uri =
  'http://localhost:8204/github_login' || window.location.href;
const scope = 'public_repo';
const client_id = process.env.NEXT_PUBLIC_CLIENT_ID ?? '';
const client_secret = process.env.NEXT_PUBLIC_CLIENT_SERCRET ?? '';

const oauthParams = { redirect_uri, scope, client_id };

const getAccessToken = () => {
  return localStorage.getItem(LS_ACCESS_TOKEN_KEY);
};

const setAccessToken = (token: string) => {
  if (window) localStorage.setItem(LS_ACCESS_TOKEN_KEY, token);
};

const login = () => {
  window.location.href = `${oauthUri}${Query.stringify(oauthParams)}`;
};

const logout = () => {
  localStorage.removeItem(LS_ACCESS_TOKEN_KEY);
  localStorage.removeItem(LS_USER_KEY);
};

const getTokenFormGithub = (code: string) => {
  http
    .post(
      'https://github.com/login/oauth/access_token',
      {
        code,
        client_id,
        client_secret
      },
      ''
    )
    .then((data: any) => {
      setAccessToken(data.access_token);
    })
    .catch(e => {
      console.log(e);
    });
};

const getTokenFormGithubInServer = async (code: string) => {
  return await http
    .post(
      'https://github.com/login/oauth/access_token',
      {
        code,
        client_id,
        client_secret
      },
      ''
    )
    .then((data: any) => {
      console.log(data);
      return data;
    })
    .catch(e => {
      console.log(e);
    });
};

const loadUserInfo = () => {
  if (!getAccessToken()) {
    logout();
    return Promise.resolve({});
  }

  return http.get('/user').then(user => {
    localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
    return user;
  });
};

export {
  getAccessToken,
  setAccessToken,
  loadUserInfo,
  login,
  logout,
  getTokenFormGithub,
  getTokenFormGithubInServer
};
