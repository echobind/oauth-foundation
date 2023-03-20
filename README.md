# OAuth Foundation

A repository showing a minimal implementation of an OAuth provider. Currently just the `authorization_code` and `password` flows are implemented, but more could be added.

If you intend to implement this in your own repo, be sure to check out [OAuth2 Simplified (the blog post)](https://aaronparecki.com/oauth-2-simplified/) and also [OAuth2 Simplified (the book)](https://www.oauth.com) which are full of a wealth of knowledge.

The specific parts of this implementation that might be interesting to you:

- `prisma/schema.prisma` - Shows how all of the OAuth data is modeled.
- `prisma/seeds/oauth/index.ts` - Generates the minimal data needed to set up an OAuth app.
- `pages/auth.tsx` - A page for requesting an authenticated user grant access to an app.
- `pages/api/authComplete.ts` - After a user grants authorization requests, this stores the authorization code info in the database.
- `app/token/route.ts` - Takes a user-provided authorization code and exchanges it for an auth token.
- `lib/auth/ts` - Checks an auth token to see if its valid.
- `pages/api/auth/me.ts` - Takes an auth token and provides user information for the corresponding user.

## Give it a Whirl

Install dependencies, set up the app, and run it.

```
yarn
yarn db:setup
yarn dev
```

Navigate to the auth page as if you were redirected there by another app. Here, you can use this link: http://localhost:3000/auth?response_type=code&client_id=test-client&redirect_uri=http://example.org/cb&scope=email&state=testing1234

After you sign up and authorize the app, it should redirect you. Grab the `code` URL param and use it in a POST request to this URL: http://localhost:3000/token You can use this body:

```json
{
    "grant_type":"authorization_code",
    "code":"YOUR CODE HERE",
    "redirect_uri":"http://example.org/cb",
    "client_id":"test-client",
    "client_secret":"super-secret"
}
```

That will give you an auth token, which you can then use in the `Authorization` header when making a request to `http://localhost:3000/api/auth/me`.

Tada! You just manually completed an OAuth sign in flow. Congrats!