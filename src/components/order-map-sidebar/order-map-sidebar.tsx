import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import { useAppDispatch, useAppSelector } from '../../components/app'
import { FilteredOrder } from '../../packages/tradefact-objects/order'
import { toggleState } from '../../reducers/create-order-slice'
import SidebarFilters from './sidebar-filters'
import SidebarOrder from './sidebar-order'

const OrderMapSidebar = ({ provider }: { provider: any }) => {
  const { filteredList, loading } = useAppSelector(state => state.order)

  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  return (
    <div className='map-sidebar'>
      <SidebarFilters />
      <div className='sidebar-list'>
        {filteredList &&
          filteredList.map((order: FilteredOrder, i) => (
            <SidebarOrder key={i} order={order} provider={provider} />
          ))}
      </div>
      <div className='order-checkbox-list'>
        {loading === false && filteredList.length === 0 && (
          <div className='d-flex flex-column justify-content-center align-items-center empty-list-view pt-3'>
            <i className='fas fa-map-marker-alt-slash'></i>
            <p className='pt-3'>{t('map.noActiveDeviceMessage')}</p>
            <Link
              onClick={() => dispatch(toggleState('modalOpen'))}
              to={{
                pathname: '/create-order',
                state: { background: location }
              }}
            >
              <Button color='primary' className='rounded-container mr-3 mt-3'>
                <i className='far fa-plus mr-2' />
                {t('generic.orderFlares')}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderMapSidebar
