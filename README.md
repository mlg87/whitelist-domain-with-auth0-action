# whitelist-domain-with-auth0-action

We use this to whitelist and then remove callback and logout URLs with Auth0 for PR apps

## Action inputs

| Input                            | Description                                                                                                     | Required | Type     | Default       |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------- | -------- | ------------- |
| `app-base-url`                   | Base domain for your PR apps. E.g `https://subdomain.our-acceptance-env.com`                                    | `true`   | `String` | n/a           |
| `append-callback-string`         | Boolean indicating whether or not to append '/callback' to the URL to register with Auth0                       | `false`  | `String` | `'true'`      |
| `auth0-application-id`           | App ID we are going to whitelist URLs for                                                                       | `true`   | `String` | n/a           |
| `auth0-management-client-secret` | Client secret obtained from Auth0                                                                               | `true`   | `String` | n/a           |
| `auth0-management-client-id`     | Client ID obtained from Auth0. This is for a machine to machine app that has access to the Auth0 Management API | `true`   | `String` | n/a           |
| `auth0-management-domain`        | Auth domain in Auth0                                                                                            | `true`   | `String` | n/a           |
| `command`                        | Either `'whitelist'` or `'remove'`                                                                              | `false`  | `String` | `'whitelist'` |
| `register-logout-url`            | Boolean indicatiing whether or not to register a logout URL with Auth0                                          | `false`  | `String` | `'true'`      |
