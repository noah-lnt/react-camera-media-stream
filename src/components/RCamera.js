import React, { useEffect, useRef, useState } from 'react'
import screenfull from 'screenfull'
import style from './RCamera.css'

export const RCamera = (props) => {
  const [modelHeight, setModelHeight] = useState(null)
  const [modelWidth, setModelWidth] = useState(null)
  const [isConfirm, setIsConfirm] = useState(false)
  const [isAnimation, setIsAnimation] = useState(false)
  const [data, setData] = useState(false)
  const containerRef = useRef(null)
  const cameraBodyRef = useRef(null)
  const videoRef = useRef(null)
  const modelRef = useRef(null)
  const canvasRef = useRef(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: { ideal: 2048 },
          height: { ideal: 1536 },
          facingMode: 'environment'
        }
      })
      videoRef.current.srcObject = stream
    } catch (e) {
      console.log(e)
    }
  }

  const handleCanPlay = () => {
    setSize()
  }

  const handleTakePicture = () => {
    setIsAnimation(true)
    setTimeout(() => {
      setIsAnimation(false)
    }, 600)
    const canvas = canvasRef.current
    let width = 0
    let height = 0
    if (videoRef.current.offsetWidth > videoRef.current.offsetHeight) {
      width = props.max ? props.max : 1920
      height =
        (videoRef.current.offsetHeight * width) / videoRef.current.offsetWidth
    } else {
      height = props.max ? props.max : 1920
      width =
        (videoRef.current.offsetWidth * height) / videoRef.current.offsetHeight
    }
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0, width, height)
    const data = canvas.toDataURL(
      'image/jpeg',
      props.imageCompression ? props.imageCompression : 0.8
    )
    if (props.isConfirm) {
      setIsConfirm(true)
      setData(data)
    } else {
      props.onTakePicture(data)
    }
  }

  const setSize = () => {
    if (videoRef.current) {
      const videoHeight = videoRef.current.videoHeight
      const videoWidth = videoRef.current.videoWidth
      const videoRatio = videoHeight / videoWidth

      const clientHeight = cameraBodyRef.current.clientHeight
      const clientWidth = cameraBodyRef.current.clientWidth
      const clientRatio = clientHeight / clientWidth

      if (props.model) {
        setModelHeight(null)
        setModelWidth(null)

        const modelHeight = modelRef.current.clientHeight
        const modelWidth = modelRef.current.clientWidth
        const modelRatio = modelHeight / modelWidth

        if (modelRatio > clientRatio) {
          setModelHeight(clientHeight - 20)
        } else {
          setModelWidth(clientWidth - 20)
        }
      }

      if (videoRatio > clientRatio) {
        videoRef.current.height = clientHeight
        videoRef.current.width = (videoWidth * clientHeight) / videoHeight
      } else {
        videoRef.current.height = (videoHeight * clientWidth) / videoWidth
        videoRef.current.width = clientWidth
      }
    }
  }

  useEffect(() => {
    if (props.isFullscreen) {
      screenfull.request(containerRef.current)
    }
    startCamera()
    window.addEventListener('resize', setSize)
    document.body.style.overflow = 'hidden'
    return () => {
      if (props.isFullscreen) {
        screenfull.toggle(containerRef.current)
      }
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div ref={containerRef} className={style['RCamera-container']}>
      <div className={style['RCamera-camera']}>
        <div ref={cameraBodyRef} className={style['RCamera-camera-body']}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onCanPlay={handleCanPlay}
            className={isAnimation ? style['RCamera-animation'] : ''}
          />
          {props.model ? (
            <img
              ref={modelRef}
              src={props.model}
              height={modelHeight}
              width={modelWidth}
            />
          ) : (
            ''
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
        <div className={style['RCamera-camera-footer']}>
          <button onClick={props.onClose}>Cancel</button>
          <button onClick={handleTakePicture}>Take Photo</button>
        </div>
      </div>
      {isConfirm ? (
        <div className={style['RCamera-preview']}>
          <div className={style['RCamera-preview-body']}>
            <img
              src={data}
              className={isAnimation ? style['RCamera-animation'] : ''}
            />
          </div>
          <div className={style['RCamera-preview-footer']}>
            <button onClick={() => setIsConfirm(false)}>Retake</button>
            <button
              onClick={() => {
                setIsConfirm(false)
                props.onTakePicture(data)
              }}
            >
              Use Photo
            </button>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
