# React Camera MediaStream

**Camera component for React.**

**Note: Browsers will throw an error if the page is loaded from insecure origin. I.e. Use https.**

## Installation

    npm install --save react-camera-media-stream

## Documentation

| Props | Type | Default | Details |
|--|--|--|--|
| max | int | 1920 | max width or height picture |
| namePicture | string | "" | name added on left corner picture |
| imageCompression | float | 0.8 | quality of picture (0 to 1) |
| isConfirm | boolean | false | confirmation after take picture |
| onTakePicture | function |  | click take picture |
| model | string | "" | model on first plan camera |
| isFullscreen | boolean | false | view in fullscreen (not all navigator are compatible) |
| onClose | function |  | click close view camera |
| textCancel | string | "Cancel" | text for button cancel |
| textPicture | string | "Take  picture" | text for button take picture |
| textTorch | string | "Enable  torch" | text for button enable/disable torch (not all navigator are compatible) |
| textAgain | string | "Retake" | text for button again |
| textConfirm | string | "Confirm" | text for button confirm |


## Getting started

### Import Component and style
    import { RCamera } from  'react-camera-media-stream'
    import  'react-camera-media-stream/dist/index.css'
    
### Render Component
    <RCamera
	    model={require('./images/model.png')}
	    isConfirm={false}
	    onTakePicture={(data) =>  console.log(data)}
		onClose={() =>  setTest(false)}
	    isFullscreen={true}
	    namePicture="test"
	    isTorch={true}
    />
