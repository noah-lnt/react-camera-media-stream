import * as React from 'react'

function RotateIcon(props) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='#ffffff'
      style={{ width: '100%', height: '100%' }}
      {...props}
    >
      {/* circular arrow rotate icon */}
      <path d='M12 6V3l4 4-4 4V7a5 5 0 1 0 5 5h2a7 7 0 1 1-7-7z' />
    </svg>
  )
}

export default RotateIcon
