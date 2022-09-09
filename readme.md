# QRTicket

A MERN web-application to scan a virtual ticket, this ticket is in the form of a QR code.
And allow the user to submit a proof of purchase to claim the ticket via an Email.

## Enviroment file

- required to be filled for the backend to run.

`.env` in './.env'

| key       | value                                                                                                                      |
| --------- | -------------------------------------------------------------------------------------------------------------------------- |
| DB_URI    | Mongodb connection string, for example `mongodb+srv://??:??@??db.k4yey.mongodb.net/myDatabase?retryWrites=true&w=majority` |
| email     | Email name, used to send the QR code from.                                                                                 |
| emailpass | The email's password                                                                                                       |

## Install

To install the node_modules of both the Backend and Frontend do:
`yarn install:all`

## Run the application

`yarn start`

### Developement setup

- Deployment platform is Vercel.
- Secrets are in ./.env, And stored in vercel as well.
- Vercel also has enviroment variable CI=false , that's to not fail during building when a warning occures.
- Github contains Vercel secrets project-id, org-id, account token to be used in the build workflow.
- Build does not happen in Vercel, but using Github workflows then uploading the build to Vercel.
- To build and deploy from a local machine use `yarn vercel`.

#### Personal notes

presistant storage providers:
https://vercel.com/docs/concepts/solutions/databases
