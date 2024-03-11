import React, { useState } from 'react'

import { RCamera } from 'react-camera-media-stream'
import 'react-camera-media-stream/dist/index.css'

const App = () => {
  const [test, setTest] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        background:
          'linear-gradient(60deg, rgba(108, 57, 255, 1), rgba(217, 66, 255, 1))',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 20
      }}
    >
      <h1
        style={{
          color: '#fff'
        }}
      >
        React Camera MediaStream
      </h1>
      <button
        style={{
          backgroundColor: 'rgba(108, 57, 255, 1)',
          border: 0,
          padding: 16,
          color: '#fff',
          borderRadius: 6,
          boxShadow: ' 2px 4px 12px 0px rgba(80, 41, 41, 0.15)'
        }}
        onClick={() => setTest(true)}
      >
        Open Camera
      </button>
      {test ? (
        <RCamera
          model={require('./images/model.png')}
          isConfirm={false}
          onTakePicture={(data) => console.log(data)}
          onClose={() => setTest(false)}
          isFullscreen={true}
          namePicture='test'
          isTorch={true}
          isFixButton={true}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default App
