import { graph, connector, config } from '@grafbase/sdk';

const g = graph.Standalone();

const jwt = connector.JSONWebToken({
  issuer: 'nextauth',
  secret: process.env.NEXTAUTH_SECRET
});

g.auth(jwt, {
  rules: {
    private: {
      allow: {
        isLoggedIn: true
      }
    }
  }
});

const github = connector.GraphQL('GitHub', {
  url: 'https://api.github.com/graphql',
  headers: (headers) => {
    headers.set('Authorization', { forward: 'Authorization' });
  }
});

g.datasource(github);

const Message = g.model('Message', {
  username: String,
  avatar: String,
  body: String,
  likes: Number,
  dislikes: Number
});

export default config({
  graph: g,
  cache: {
    rules: [
      {
        types: ['Query'],
        maxAge: 60
      }
    ]
  }
});
