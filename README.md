# React Camera MediaStream

[![NPM](https://img.shields.io/npm/v/react-camera-media-stream.svg)](https://www.npmjs.com/package/react-camera-media-stream) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

**Camera component for React.**

**Note: Browsers will throw an error if the page is loaded from insecure origin. I.e. Use https.**

## Installation

```bash
npm install --save react-camera-media-stream
```

## Documentation

| Props | Type | Default | Details |
|--|--|--|--|
| max | int | 1920 | max width or height picture |
| namePicture | string | "" | name added on left corner picture |
| imageCompression | float | 0.8 | quality of picture (0 to 1) |
| isConfirm | boolean | false | confirmation after take picture |
| onTakePicture | function |  | click take picture |
| onError | function |  | on error |
| model | string | "" | model on first plan camera |
| marginModel | int | 40 | margin model |
| isFullscreen | boolean | false | view in fullscreen (not all navigator are compatible) |
| onClose | function |  | click close view camera |
| isTextMode | boolean | false | button text / button icon |
| textCancel | string | "Cancel" | text for button cancel |
| textPicture | string | "Take  picture" | text for button take picture |
| textTorch | string | "Enable  torch" | text for button enable/disable torch (not all navigator are compatible) |
| textAgain | string | "Retake" | text for button again |
| textConfirm | string | "Confirm" | text for button confirm |

## Getting started

### Import Component and style

```js
import { RCamera } from  'react-camera-media-stream'
import  'react-camera-media-stream/dist/index.css'
```

### Render Component

```js
<RCamera
  model={require('./images/model.png')}
  isConfirm={false}
  onTakePicture={(data) =>  console.log(data)}
  onError={() => {}}
  onClose={() => setTest(false)}
  isFullscreen={true}
  namePicture="test"
  isTorch={true}
/>
```

## License

MIT © [noah-lnt](https://github.com/noah-lnt)
