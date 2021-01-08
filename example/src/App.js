import React, { useState } from 'react'

import { RCamera } from 'react-camera-media-stream'
import 'react-camera-media-stream/dist/index.css'

const App = () => {
  const [test, setTest] = useState(false)

  return <div>
    <button onClick={() => setTest(true)}>OUVRIR CAMERA</button>
    {test ? <RCamera
      model={require('./images/model.png')}
      isConfirm={false}
      onTakePicture={(data) => console.log(data)}
      onClose={() => setTest(false)}
      isFullscreen={true}
      namePicture="test"
      isTorch={true}
    /> : ''}
  </div>
}

export default App
