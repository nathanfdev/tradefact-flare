import { UncontrolledTooltip } from 'reactstrap'
import React, { useEffect, useState, useRef } from 'react'

const TextEllipsisTooltip = (displayText: { displayText: string }) => {
  const displayTextSpanRef = useRef(null)
  const [tooltipVisibility, setTooltipVisibility] = useState(false)
  useEffect(() => {
    isEllipsisActive(displayTextSpanRef)
  }, [tooltipVisibility])
  const isEllipsisActive = (currentElement: any) => {
    let element = currentElement.current
    if (element) {
      element.style.overflow = 'initial'
      const scrollWidth = element.scrollWidth
      element.style.overflow = 'hidden'
      const ellipsisWidth = element.offsetWidth
      return setTooltipVisibility(ellipsisWidth < scrollWidth)
    }
  }
  return (
    <>
      <span className='ellipsis-text' ref={displayTextSpanRef}>
        {displayText.displayText}
      </span>
      {tooltipVisibility && (
        <UncontrolledTooltip
          className='text-ellipsis-tooltip'
          placement='bottom'
          target={displayTextSpanRef}
          container='td'
        >
          {displayText.displayText}
        </UncontrolledTooltip>
      )}
    </>
  )
}

export default TextEllipsisTooltip
