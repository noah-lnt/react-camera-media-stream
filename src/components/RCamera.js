import React, { useEffect, useRef, useState } from 'react'
import screenfull from 'screenfull'
import style from './RCamera.css'

import BackIcon from '../../images/BackIcon'
import CameraIcon from '../../images/CameraIcon'
import TorchIcon from '../../images/TorchIcon'
import RotateIcon from '../../images/RotateIcon'

export const RCamera = (props) => {
  const [devices, setDevices] = useState([])
  const [currentDeviceId, setCurrentDeviceId] = useState(null)
  const [modelHeight, setModelHeight] = useState(null)
  const [modelWidth, setModelWidth] = useState(null)
  const [isConfirm, setIsConfirm] = useState(false)
  const [isAnimation, setIsAnimation] = useState(false)
  const [isTorch, setIsTorch] = useState(false)
  const [data, setData] = useState(false)
  const containerRef = useRef(null)
  const cameraBodyRef = useRef(null)
  const videoRef = useRef(null)
  const modelRef = useRef(null)
  const canvasRef = useRef(null)

  const startCamera = async (deviceId = null) => {
    try {
      // stop existing tracks if any
      try {
        const oldStream = videoRef.current && videoRef.current.srcObject
        if (oldStream && oldStream.getTracks) {
          oldStream.getTracks().forEach((t) => t.stop())
        }
      } catch (e) {}

      const videoConstraints = deviceId
        ? { deviceId: { exact: deviceId } }
        : {
            width: 2560,
            height: 1440,
            facingMode: 'environment'
          }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: videoConstraints
      })
      videoRef.current.srcObject = stream
      setIsTorch(false)
    } catch (err) {
      console.log(err)
      if (props.onError) {
        props.onError()
      }
    }
  }

  const startTorch = () => {
    try {
      const mediaStream = videoRef.current.srcObject
      const track = mediaStream.getVideoTracks()[0]

      if (!isTorch) {
        track
          .applyConstraints({
            advanced: [{ torch: true }]
          })
          .then(function () {
            setIsTorch(true)
          })
          .catch((e) => {
            setIsTorch(true)
            console.log(e)
          })
      } else {
        track
          .applyConstraints({
            advanced: [{ torch: false }]
          })
          .then(function () {
            console.log(isTorch)
            setIsTorch(false)
          })
          .catch((e) => {
            setIsTorch(false)
            console.log(e)
          })
      }
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

    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoRef.current, 0, 0, width, height)
    if (props.namePicture) {
      ctx.font = '22px Sans-Serif'
      ctx.fillStyle = 'red'
      ctx.fillText(props.namePicture, 20, 40)
    }

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
      setTimeout(() => {
        console.log(videoRef.current.videoHeight, videoRef.current.videoWidth)
        const clientHeight = videoRef.current.clientHeight
        const clientWidth = videoRef.current.clientWidth

        if (props.model) {
          setModelHeight(null)
          setModelWidth(null)

          setModelHeight(clientHeight - (props.marginModel || 40))
          setModelWidth(clientWidth - (props.marginModel || 40))
        }
      }, 500)
    }
  }

  useEffect(() => {
    if (props.isFullscreen && screenfull.isEnabled) {
      try {
        screenfull.request(containerRef.current)
      } catch (e) {}
    }
    // ensure we have permission first — some browsers only expose all devices after getUserMedia
    ;(async () => {
      try {
        // request a small temporary stream to prompt permission
        const permStream = await navigator.mediaDevices.getUserMedia({
          video: true
        })
        // stop permission stream immediately
        try {
          permStream.getTracks().forEach((t) => t.stop())
        } catch (e) {}
      } catch (e) {
        // ignore permission error here; enumerateDevices may still work
      }

      try {
        const list = await navigator.mediaDevices.enumerateDevices()
        const videoInputs = list.filter((d) => d.kind === 'videoinput')
        setDevices(videoInputs)
        // try to prefer a previously selected device or start with first
        // Preferences (in order): props.defaultDeviceId, props.defaultDeviceLabel match,
        // previously selected device, AR/back camera heuristic, first available
        const arDevice = videoInputs.find(
          (d) => d.label && /ar|rear|back/i.test(d.label)
        )
        // match by label if provided
        const labelDevice = props.defaultDeviceLabel
          ? videoInputs.find((d) =>
              d.label
                ? d.label
                    .toLowerCase()
                    .includes(props.defaultDeviceLabel.toLowerCase())
                : false
            )
          : null

        const initialDevice =
          (props.defaultDeviceId && props.defaultDeviceId) ||
          (labelDevice && labelDevice.deviceId) ||
          currentDeviceId ||
          (arDevice && arDevice.deviceId) ||
          (videoInputs[0] && videoInputs[0].deviceId)
        setCurrentDeviceId(initialDevice)
        startCamera(initialDevice)
      } catch (err) {
        // fallback to simple start
        startCamera()
      }
    })()
    window.addEventListener('resize', setSize)
    document.body.style.overflow = 'hidden'
    return () => {
      if (props.isFullscreen && screenfull.isEnabled) {
        try {
          screenfull.toggle(containerRef.current)
        } catch (e) {}
      }
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleClose = () => {
    const mediaStream = videoRef.current.srcObject
    try {
      mediaStream.getTracks().forEach(function (track) {
        track.stop()
      })
    } catch (e) {}

    props.onClose()
  }

  const handleRotateCamera = () => {
    try {
      if (!devices || devices.length <= 1) return
      const currentIndex = devices.findIndex(
        (d) => d.deviceId === currentDeviceId
      )
      const nextIndex = (currentIndex + 1) % devices.length
      const nextDevice = devices[nextIndex]
      if (nextDevice) {
        setCurrentDeviceId(nextDevice.deviceId)
        startCamera(nextDevice.deviceId)
      }
    } catch (e) {
      console.log(e)
    }
  }

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
            <div
              style={{
                height: modelHeight,
                width: modelWidth
              }}
            >
              {console.log(modelHeight)}
              <img ref={modelRef} src={props.model} />
            </div>
          ) : (
            ''
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
        {props.isTextMode ? (
          <div className={style['RCamera-camera-footer']}>
            <button onClick={handleClose}>
              {props.textCancel ? props.textCancel : 'Cancel'}
            </button>
            <button onClick={handleTakePicture}>
              {props.textPicture ? props.textPicture : 'Take picture'}
            </button>
            {props.isTorch ? (
              <button
                className={isTorch ? style['RCamera-torch-enable'] : ''}
                onClick={startTorch}
              >
                {props.textTorch ? props.textTorch : 'Enable torch'}
              </button>
            ) : (
              ''
            )}
            {devices && devices.length > 1 ? (
              <button onClick={handleRotateCamera}>
                {props.textRotate ? props.textRotate : 'Rotate'}
              </button>
            ) : (
              ''
            )}
          </div>
        ) : (
          <div
            className={
              props.isFixButton && window.innerWidth > window.innerHeight
                ? style['RCamera-container-button-icon-right']
                : style['RCamera-container-button-icon']
            }
          >
            <div
              className={style['RCamera-button-icon']}
              style={{ width: '52px', height: '52px' }}
              onClick={handleClose}
            >
              <BackIcon />
            </div>
            <div
              className={style['RCamera-button-icon']}
              style={{ width: '64px', height: '64px' }}
              onClick={handleTakePicture}
            >
              <CameraIcon />
            </div>
            <div
              className={
                style['RCamera-button-icon'] +
                ' ' +
                (isTorch ? style['RCamera-torch-enable'] : '')
              }
              style={{ width: '52px', height: '52px' }}
              onClick={startTorch}
            >
              <TorchIcon />
            </div>
            {devices && devices.length > 1 ? (
              <div
                className={style['RCamera-button-icon']}
                style={{ width: '52px', height: '52px' }}
                onClick={handleRotateCamera}
              >
                <RotateIcon />
              </div>
            ) : (
              ''
            )}
          </div>
        )}
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
            <button onClick={() => setIsConfirm(false)}>
              {props.textAgain ? props.textAgain : 'Retake'}
            </button>
            <button
              onClick={() => {
                setIsConfirm(false)
                props.onTakePicture(data)
              }}
            >
              {props.textConfirm ? props.textConfirm : 'Confirm'}
            </button>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
