# dddbot

![](https://travis-ci.org/nicolaseckhart/dddbot.svg?branch=master) 

## Setup

Clone repository and navigate into the folder:
```bash
git clone git@github.com:nicolaseckhart/dddbot.git
cd dddbot
```
Install node dependencies:

```bash
npm install
```

You'll need to create a .env file to hold your bot token & database url:

```bash
echo "TOKEN=your-token\nDATABASE_URL=postgres://your-db-url" >> .env
```

Whatever pg database you use, run the sql in `schema.sql` to set up the needed
tables.

## Tests

Run lints, tests and coverage report checks:

```bash
npm test
```

Run linter:

```bash
npm run lint
```

Run linter with autocorrections:

```bash
npm run lint:fix
```

## Run

Run the bot with:

```bash
npm start
```

Run the bot in development mode (with nodemon autorestart):

```bash
npm start:dev
```

