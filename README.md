# Alexa Radio

Alexa Radio lets you create channels of streaming stations and play them with an Alexa skill. The web editor is served from Vercel, and the Alexa skill backend runs as a Vercel Function. Station configuration and audiobook playback progress are stored in Upstash Redis.

## Deploy to Vercel

1. Fork this repository on GitHub.
2. Import the fork as a project in Vercel. The included [vercel.json](./vercel.json) builds static files from `public/` and deploys the handlers in `functions/`, with no `api/` directory required.
3. Create or connect an Upstash Redis database through the Vercel Marketplace. In **Project Settings → Environment Variables**, add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for the environments you deploy to. Treat the token as a secret and do not put either value in the repository. The compatible `KV_REST_API_URL` and `KV_REST_API_TOKEN` names are also accepted.
4. If you use a custom domain, add `PUBLIC_URL` in **Project Settings → Environment Variables** with its HTTPS origin (for example, `https://radio.example.com`). Otherwise the Alexa backend uses the deployment host from the incoming request.
5. Redeploy after adding or changing environment variables. Open the Vercel project URL to add stations and verify the editor loads.

The editor is at `/`, the station API is `/api/stations`, and the Alexa endpoint is `/api/alexa`. Redis uses one shared `channels` key, so the Vercel deployment and Alexa skill share the same station list.

> **Access note:** The station editor and its write API are public, as they were in the original version. Anyone who can reach the deployment can change its channels and responses. Put an access-control layer in front of the editor/API before using this for a private or multi-user deployment.

## Configure the Alexa skill

1. Create a Custom Alexa skill and paste [AlexaInteractionModel.json](./AlexaInteractionModel.json) into its JSON Editor. The invocation name is `radio` by default.
2. In the skill's endpoint settings, select the HTTPS endpoint option and enter `https://your-project.vercel.app/api/alexa` (or the equivalent custom-domain URL).
3. Enable the **Audio Player** interface, build the interaction model, and test the skill.
4. Open the deployment's root URL to create channels and add stations. Station stream URLs must use HTTPS.

## Local development

For local development, install dependencies with `npm install` and run the project with `vercel dev`. Supply the Redis credentials through your local shell environment; do not create or commit a `.env` file. Keep production credentials in Vercel's Environment Variables settings.

The Alexa request handler verifies Amazon's request signature before processing the envelope. The static site and media assets are under `public/`; audio artwork and the playback-failure audio are served from `public/data/`.
