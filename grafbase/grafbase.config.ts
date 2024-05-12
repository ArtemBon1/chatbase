import { graph, config, connector } from '@grafbase/sdk';
import { JWTAuth, JWTParams } from '@grafbase/sdk/dist/src/auth/jwt'; // Assuming JWT auth

const g = graph.Standalone();

// Assuming you have a JWT secret stored in an environment variable
const jwtSecret = process.env.NEXTAUTH_SECRET as string;

const jwtAuth = new JWTAuth({
  issuer: 'nextauth',
  secret: jwtSecret,
});

const github = connector.GraphQL('GitHub', {
  url: 'https://api.github.com/graphql',
  headers: (headers) => {
    headers.set('Authorization', `Bearer ${process.env.GITHUB_TOKEN}`);
  },
});

g.datasource(github);

interface IMessage {
  username: String,
  avatar: String,
  body: String,
  likes: Number,
  dislikes: Number
}

const Message = g.type('Message', {
  username: g.string(),
  avatar: g.string(),
  body: g.string(),
  likes: g.int(),
  dislikes: g.int()
});

export default config({
  graph: g,
  auth: {
    providers: [github],
    rules: rules => {
      rules.private()
    },
  },
})
