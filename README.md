# Font Bingo

[View the site](https://bingo.jennybelanger.com/).

## Development

### Requirements

- [Git](https://git-scm.com/)
- [Node](https://nodejs.org/)

### Setup

``` bash
git clone https://github.com/jlbelanger/bingo.git
cd bingo
./setup.sh
```

### Run

``` bash
npm start
```

Your browser should automatically open https://localhost:3000/

### Lint

``` bash
npm run lint
```

### Generate splash screens

``` bash
npx pwa-asset-generator public/icon.png ./public/assets/splash --background "#999" --splash-only --type png --portrait-only --padding "20%"
```

## Deployment

Note: The deploy script included in this repo depends on other scripts that only exist in my private repos. If you want to deploy this repo, you'll have to create your own script.

``` bash
./deploy.sh
```
