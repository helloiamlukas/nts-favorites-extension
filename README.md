# NTS Radio - Favorites Extension
![Chrome Web Store](https://img.shields.io/chrome-web-store/v/dlolfbeclhpomkpamfcfjfjefedpbifm?style=flat-square)

Browser extension to save your favorite [NTS Radio shows & episodes](https://www.nts.live/) 🖤

![NTS Favorites Extension](nts-favorites-cover.gif)

## Features

- Works with Google Chrome
- Save your favorite shows & episodes directly from the NTS Radio website
- Search your saved shows & episodes
- Synchronize your favorites on multiple devices ([via your Google Account](https://support.google.com/chrome/answer/185277))
- Import & Export all saved shows/episodes

![NTS Favorites Extension](nts-favorites-preview.jpg)

### Upcoming Features

- Firefox support

## Installation
### Chrome Web Store
You can install this extension through the Google Web Store.
- [NTS Favorites - Chrome Web Store](https://chrome.google.com/webstore/detail/nts-favorites/dlolfbeclhpomkpamfcfjfjefedpbifm)

## Development
If you want to compile this extension by yourself or want to contribute, you have to clone it and install the depedencies

```bash
git clone https://github.com/helloiamlukas/nts-favorites-extension.git
cd nts-favorites-extension
yarn install
```

After that, you can compile the extension and zip it
```bash
yarn build
yarn build-zip
```

If you want to develope this extension you can run
```bash
yarn watch:dev
```
or
```bash
yarn build:dev
```

💡For further information, please take a look at the [Google Chrome Extension Documentation](https://developer.chrome.com/extensions) as well as the
[vue-web-extension GitHub Repository](https://github.com/Kocal/vue-web-extension).

## Hlep 🤔

For questions regarding this project, please use the [Issue](https://github.com/helloiamlukas/nts-favorites-extension/issues) section. 