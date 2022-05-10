import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import {
  Carousel,
  CarouselControl,
  CarouselIndicators,
  CarouselItem,
  Modal,
  ModalBody,
  ModalHeader
} from 'reactstrap'

const Help = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const history = useHistory()
  const { t } = useTranslation()

  const items = [
    {
      altText: 'Slide 1',
      caption: `${t('help.stepOne')}.`,
      key: 1,
      src: '/images/help/step_one.svg'
    },
    {
      altText: 'Slide 2',
      caption: `${t('help.stepTwo')}.`,
      key: 2,
      src: '/images/help/step_two.svg'
    },
    {
      altText: 'Slide 3',
      caption: `${t('help.stepThree')}.`,
      key: 3,
      src: '/images/help/step_three.svg'
    },
    {
      altText: 'Slide 4',
      caption: `${t('help.stepFour')}.`,
      key: 4,
      src: '/images/help/step_four.svg'
    }
  ]

  const selectIndex = (idx: number) => {
    setActiveIndex(idx)
  }

  const next = () => {
    if (activeIndex !== items.length - 1) setActiveIndex(activeIndex + 1)
  }
  const previous = () => {
    if (activeIndex !== 0) setActiveIndex(activeIndex - 1)
  }

  const handleToggle = () => {
    history.goBack()
  }

  const slides = items.map((item, i) => {
    return (
      <CarouselItem
        onExiting={function noRefCheck() {}}
        onExited={function noRefCheck() {}}
        key={item.src}
      >
        <img src={item.src} alt={item.altText} />
        <h3>
          <span className='text-secondary mr-2'>{i + 1}.</span> {item.caption}
        </h3>
      </CarouselItem>
    )
  })

  return (
    <Modal isOpen={true} className='help-carousel'>
      <ModalHeader toggle={handleToggle}>{t('help.howDoesFlare')}?</ModalHeader>
      <ModalBody>
        <Carousel
          className={'help-carousel'}
          activeIndex={activeIndex}
          next={function noRefCheck() {}}
          previous={function noRefCheck() {}}
        >
          <CarouselIndicators
            items={items}
            activeIndex={activeIndex}
            onClickHandler={selectIndex}
          />
          {slides}
          {activeIndex !== 0 && (
            <CarouselControl
              direction='prev'
              directionText={t('generic.previous')}
              onClickHandler={previous}
            />
          )}
          {activeIndex < items.length - 1 && (
            <CarouselControl
              direction='next'
              directionText={t('generic.next')}
              onClickHandler={next}
            />
          )}
        </Carousel>
      </ModalBody>
    </Modal>
  )
}

export default Help
