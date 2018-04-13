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

You'll need to copy the `config.example.json` file and fill in your bot token:

```bash
cp config/config.example.json config/config.json
```



## Tests

Run all tests and display coverage report:

```bash
npm test
```

## Run

Run the bot with nodemon (autorefresh):

```bash
npm start
```

