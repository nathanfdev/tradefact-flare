import moment from 'moment'
import { Device } from '../../../packages/tradefact-objects/order'
import { t } from 'i18next'
import { store } from '../../../components/app/store'
import { saveMapState } from '../../../reducers/map-view-slice'

export const createBubbleTemplate = (data: Device[], presetIndex = 0) => {
  const isClustered = data.length > 1
  const wrapper = document.createElement('div')
  wrapper.classList.add('cluster-wrapper')
  if (!isClustered) {
    wrapper.classList.add('cluster-single')
  }

  const header = document.createElement('div')
  header.classList.add('cluster-tabs')

  const tabs = [document.createElement('div'), document.createElement('div')]

  const setTab = (e: any) => {
    const dir = e.currentTarget.getAttribute('data-dir')

    // Visible state at time of event firing
    const currentTab = wrapper.querySelector('.cluster-visible')
    const currentIndex = Number(currentTab?.getAttribute('data-tab'))
    const indicator = wrapper.querySelector('#cluster-tab-count')

    // Expected upcoming state for next event
    // Tab index is used for visual display and index so we shift accordingly
    const nextIndex = dir === 'right' ? currentIndex + 1 : currentIndex - 1
    const nextTab = wrapper.querySelector(`[data-tab='${nextIndex}']`)

    if (nextTab) {
      currentTab?.classList.remove('cluster-visible')
      nextTab?.classList.add('cluster-visible')

      store.dispatch(
        saveMapState({
          target: 'selectedDevice',
          value: data[nextIndex - 1]
        })
      )

      if (indicator) {
        ;(indicator as HTMLElement).innerText = String(nextIndex)
      }
    }
  }

  tabs.forEach((tab, i) => {
    const dir = i ? 'right' : 'left'
    tab.addEventListener('click', setTab)
    tab.setAttribute('data-dir', dir)
    tab.innerHTML = `<i class="fas fa-arrow-${dir}"></i>`
  })

  const devices = document.createElement('span')
  devices.innerHTML = `<span><span id='cluster-tab-count'>${presetIndex +
    1}</span> of ${data.length} ${t('generic.devices')}</span>`

  header.appendChild(tabs[0])
  header.appendChild(devices)
  header.appendChild(tabs[1])

  data.forEach((device, i) => {
    const countryContent =
      device.countryOfDelivery &&
      device.countryOfDestination &&
      `<div>
        <span>
          ${device.countryOfDelivery}
          <i class='far fa-arrow-right'></i>
          ${device.countryOfDestination}
        </span>
      </div>
      `
    const lastUpdatedContent = () => {
      const date = moment(device.lastUpdated).format('L')
      const time = moment(device.lastUpdated).format('LT')
      const duration = moment(device.lastUpdated)
        .locale(window.navigator.language)
        .fromNow()

      if (device.lastUpdated) {
        return `<span>${date} - ${time}</span>
                  <span className='secondary-color'>${duration}</span>`
      } else {
        return `<span>N/A</span>`
      }
    }

    const index = i + 1

    wrapper.insertAdjacentHTML(
      'afterbegin',
      `<div
        data-tab='${index}'
        class='cluster-tooltip
        ${index == presetIndex + 1 ? 'cluster-visible' : ''}'>
        <div>
          <a href='${process.env.APP_URL}/#/list-view?search=${
        device.deviceId
      }'>
            <h6 class='m-0 header'>${device.deviceLabel}</h6>
          </a>
        </div>
        <div class='secondary-color identification-number'>
              ${device.shipmentName}
        </div>
        <hr/>
        ${countryContent}
        <hr />
        <div class='d-flex flex-column'>
          <span class='header'>${t('map.lastUpdate')}</span>
          ${lastUpdatedContent()}
        </div>
        <hr />
        <div class='footer'>
          <div ><i class='fas fa-battery-three-quarters mr-1 primary-color'></i> ${
            device.battery ? `${device.battery}%` : 'N/A'
          }</div>
          <hr class='footer-hr' />
          <div><i class="far fa-thermometer-half mr-1 primary-color"></i> ${
            device.temperature ? `${device.temperature}\u2103` : 'N/A'
          }</div>
          <hr class='footer-hr' />
          <div><i class="fas fa-dewpoint mr-1 primary-color"></i> ${
            device.humidity ? `${device.humidity}%rh` : 'N/A'
          }</div>
          </div>
      </div>`
    )
  })

  if (isClustered) wrapper.prepend(header)

  return wrapper
}
