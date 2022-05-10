import { UserInfo } from '../packages/tradefact-objects'

declare global {
  interface Window {
    analytics: any
  }
}

export const pageAnalysis = (pageName: string, organisationId: string) => {
  window.analytics.page(
    pageName,
    {
      category: 'user',
      path: location.pathname + location.hash,
      organisation_id: organisationId
    },
    { groupId: organisationId }
  )
}

export const identifyAnalysis = (user: UserInfo) => {
  window.analytics.identify(
    user.id,
    {
      name: user.fullname,
      email: user.email,
      organisation_id: user.organisationId
    },
    {
      groupId: user.organisationId
    }
  )
}

export const groupAnalysis = (user: UserInfo) =>
  window.analytics.group(
    user.organisationId,
    {
      $name: user.organisation, //Mixpanel's way of identifying group/organisation
      name: user.organisation, //Totango's way of identifying group/organisation
      organisation_id: user.organisationId
    },
    { groupId: user.organisationId }
  )

export const trackAnalysis = (name: string, properties: any) => {
  window.analytics.track(
    name,
    { ...properties, category: 'user' },
    { groupId: properties.organisationId }
  )
}
