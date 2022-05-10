import moment from 'moment'
import React, { useEffect, useRef } from 'react'
import { getMidPointCoOrd } from '../../helpers/number-functions'
import { ShipmentType } from '../../packages/tradefact-objects'
import {
  AISTrackingResultVessel,
  HereMapPortData
} from '../../packages/tradefact-objects/shipment'

export interface HereMapProps {
  shipmentType: ShipmentType
  isDates: boolean
  etd?: Date
  eta?: Date
  loadingPort?: HereMapPortData[]
  dischargePort?: HereMapPortData | null
  vessel?: AISTrackingResultVessel[]
  multiplePickupLocations?: boolean
}

const HereMap = ({
  shipmentType,
  isDates,
  etd,
  eta,
  loadingPort,
  dischargePort,
  vessel,
  multiplePickupLocations
}: HereMapProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const portSvgMarkup = `<svg width="36" height="46" viewBox="0 0 36 46" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M35.4324 17.4242C35.4324 27.0474 27.6398 34.8485 18.027 34.8485C8.41428 34.8485 0.621613 27.0474 0.621613 17.4242C0.621613 7.8011 8.41428 0 18.027 0C27.6398 0 35.4324 7.8011 35.4324 17.4242Z" fill="#0275D8"/>
  <path d="M18.027 46L2.95349 26.1364L33.1005 26.1364L18.027 46Z" fill="#0275D8"/>
  <path d="M9.67905 20.1937H10.679C11.3456 23.2008 14.7999 24.8648 18.0422 24.8648C21.2541 24.8648 24.7084 23.2008 25.375 20.1937H26.375C26.678 20.1937 26.8598 19.8434 26.6174 19.6098L24.5872 17.6538C24.4357 17.5078 24.2236 17.5078 24.0721 17.6538L22.0419 19.6098C21.7995 19.8434 21.9813 20.1937 22.2843 20.1937H23.3752C22.7388 21.7994 20.7996 22.7336 18.9815 22.9672V17.391H20.5572C20.7693 17.391 20.9208 17.2451 20.9208 17.0407V15.8729C20.9208 15.6978 20.7693 15.5226 20.5572 15.5226H18.9815V15.3766C20.1329 14.9971 20.9208 13.9461 20.9208 12.7491C20.9511 11.2018 19.6481 9.94642 18.0725 9.94642C16.4362 9.91723 15.1333 11.1726 15.1333 12.7199C15.1333 13.9461 15.9211 14.9971 17.0725 15.3766V15.5226H15.4969C15.2848 15.5226 15.1333 15.6978 15.1333 15.8729V17.0407C15.1333 17.2451 15.2848 17.391 15.4969 17.391H17.0725V22.9672C15.2848 22.7336 13.3152 21.7994 12.6789 20.1937H13.7697C14.0727 20.1937 14.2545 19.8434 14.0121 19.6098L11.9819 17.6538C11.8304 17.5078 11.6183 17.5078 11.4668 17.6538L9.43664 19.6098C9.19423 19.8434 9.37604 20.1937 9.67905 20.1937ZM18.0422 11.7857C18.5573 11.7857 19.0118 12.2236 19.0118 12.7199C19.0118 13.2454 18.5573 13.6541 18.0422 13.6541C17.4967 13.6541 17.0725 13.2454 17.0725 12.7199C17.0725 12.2236 17.4967 11.7857 18.0422 11.7857Z" fill="white"/>
  </svg>`

  const airportDepartSvgMarkup = `<svg width="36" height="46" viewBox="0 0 36 46" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M35.2432 17.4242C35.2432 27.0474 27.4506 34.8485 17.8378 34.8485C8.2251 34.8485 0.432434 27.0474 0.432434 17.4242C0.432434 7.8011 8.2251 0 17.8378 0C27.4506 0 35.2432 7.8011 35.2432 17.4242Z" fill="#0275D8"/>
  <path d="M17.8378 46L2.76432 26.1364L32.9114 26.1364L17.8378 46Z" fill="#0275D8"/>
  <path d="M26.1058 23.0415H9.58558C9.34104 23.0415 9.15084 23.2694 9.15084 23.4973V24.409C9.15084 24.6654 9.34104 24.8649 9.58558 24.8649H26.1058C26.3232 24.8649 26.5405 24.6654 26.5405 24.409V23.4973C26.5405 23.2694 26.3232 23.0415 26.1058 23.0415ZM11.3246 20.0214C11.4876 20.2209 11.7321 20.3063 11.9767 20.3063H15.5361C15.7807 20.3063 16.1339 20.2209 16.3513 20.1069L24.2581 15.9187C24.9646 15.5198 25.6167 14.9785 26.0786 14.2377C26.5677 13.44 26.6221 12.8417 26.4319 12.4428C26.2145 12.0154 25.7526 11.702 24.8287 11.6451C24.0408 11.5881 23.2256 11.816 22.492 12.2149L19.8292 13.6394L13.8787 11.3032C13.7971 11.2462 13.6885 11.1892 13.6069 11.1892C13.5526 11.1892 13.4439 11.2177 13.3896 11.2462L11.5963 12.2149C11.2974 12.3573 11.243 12.7562 11.4604 13.0126L15.6991 15.8047L12.9005 17.3148L10.9442 16.2606C10.8898 16.2321 10.7811 16.2036 10.7268 16.2036C10.6453 16.2036 10.5638 16.2321 10.5094 16.2606L9.39538 16.8589C9.12367 17.0014 9.04215 17.4002 9.25952 17.6567L11.3246 20.0214Z" fill="white"/>
  </svg>`

  const airportArriveSvgMarkup = `<svg width="36" height="46" viewBox="0 0 36 46" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M35.054 17.4242C35.054 27.0474 27.2614 34.8485 17.6486 34.8485C8.03589 34.8485 0.243225 27.0474 0.243225 17.4242C0.243225 7.8011 8.03589 0 17.6486 0C27.2614 0 35.054 7.8011 35.054 17.4242Z" fill="#0275D8"/>
  <path d="M17.6486 46L2.57511 26.1364L32.7222 26.1364L17.6486 46Z" fill="#0275D8"/>
  <path d="M27.0973 22.9986H8.19998C7.92025 22.9986 7.70268 23.2319 7.70268 23.4652V24.3983C7.70268 24.6607 7.92025 24.8648 8.19998 24.8648H27.0973C27.3459 24.8648 27.5946 24.6607 27.5946 24.3983V23.4652C27.5946 23.2319 27.3459 22.9986 27.0973 22.9986ZM9.07025 15.9421L11.8365 18.2748C12.023 18.4498 12.3959 18.6247 12.6446 18.683L21.5648 20.9575C22.404 21.1908 23.2743 21.2199 24.0824 21.0158C25.0148 20.7825 25.45 20.4034 25.5432 19.9661C25.6675 19.5578 25.5121 19.0038 24.8284 18.3623C24.2378 17.7791 23.4608 17.4 22.6216 17.1959L19.6067 16.4378L16.4675 10.8392C16.4365 10.6642 16.2811 10.5184 16.1257 10.4892L14.1054 9.96437C13.7635 9.87689 13.4527 10.1102 13.4527 10.4601L14.9446 15.2422L11.7743 14.4258L10.904 12.4429C10.8419 12.2971 10.7175 12.1805 10.5621 12.1513L9.3189 11.8306C9.00809 11.7431 8.69728 11.9764 8.69728 12.2971V15.2714C8.69728 15.5338 8.88376 15.7671 9.07025 15.9421Z" fill="white"/>
  </svg>`

  const roadArriveSvgMarkup = `<svg width="35" height="46" viewBox="0 0 35 46" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M34.8649 17.4242C34.8649 27.0474 27.0722 34.8485 17.4595 34.8485C7.84671 34.8485 0.0540466 27.0474 0.0540466 17.4242C0.0540466 7.8011 7.84671 0 17.4595 0C27.0722 0 34.8649 7.8011 34.8649 17.4242Z" fill="#0275D8"/>
  <path d="M17.4595 46L2.38593 26.1364L32.533 26.1364L17.4595 46Z" fill="#0275D8"/>
  <path d="M10.2609 21.3994C10.3109 21.6244 10.5359 21.7494 10.7359 21.6744L16.1606 20.2245C16.3606 20.1745 16.4855 19.9495 16.4355 19.7495L15.1856 15.0998C15.1356 14.8998 14.9106 14.7748 14.7107 14.8248L12.7858 15.3498L13.3857 17.6496L11.8608 18.0746L11.2359 15.7498L9.28601 16.2747C9.08602 16.3247 8.96103 16.5497 9.01102 16.7747L10.2609 21.3994ZM18.6104 12C18.1604 12 17.8105 12.375 17.8105 12.7999V20.8994L9.13602 23.2493C9.03602 23.2993 8.98603 23.3993 9.01102 23.4993L9.31101 24.6742C9.361 24.7742 9.461 24.8242 9.56099 24.7992L19.4104 22.1244C19.4604 23.6243 20.6853 24.7992 22.2102 24.7992C23.7351 24.7992 25.01 23.5493 25.01 21.9994V12H18.6104ZM22.2102 23.1993C21.5352 23.1993 21.0103 22.6743 21.0103 21.9994C21.0103 21.3494 21.5352 20.7994 22.2102 20.7994C22.8601 20.7994 23.4101 21.3494 23.4101 21.9994C23.4101 22.6743 22.8601 23.1993 22.2102 23.1993Z" fill="white"/>
  </svg>`

  const roadDepartSvgMarkup = `<svg width="36" height="46" viewBox="0 0 36 46" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M35.6757 17.4242C35.6757 27.0474 27.883 34.8485 18.2703 34.8485C8.65753 34.8485 0.864868 27.0474 0.864868 17.4242C0.864868 7.8011 8.65753 0 18.2703 0C27.883 0 35.6757 7.8011 35.6757 17.4242Z" fill="#0275D8"/>
  <path d="M18.2703 46L3.19675 26.1364L33.3438 26.1364L18.2703 46Z" fill="#0275D8"/>
  <path d="M25.6 20.8H25.2V18.1C25.2 17.8 25.05 17.475 24.825 17.25L22.35 14.775C22.125 14.55 21.8 14.4 21.5 14.4H20.4V13.2C20.4 12.55 19.85 12 19.2 12H11.2C10.525 12 10 12.55 10 13.2V21.2C10 21.875 10.525 22.4 11.2 22.4H11.6C11.6 23.725 12.675 24.8 14 24.8C15.325 24.8 16.4 23.725 16.4 22.4H19.6C19.6 23.725 20.675 24.8 22 24.8C23.325 24.8 24.4 23.725 24.4 22.4H25.6C25.8 22.4 26 22.225 26 22V21.2C26 21 25.8 20.8 25.6 20.8ZM14 23.6C13.325 23.6 12.8 23.075 12.8 22.4C12.8 21.75 13.325 21.2 14 21.2C14.65 21.2 15.2 21.75 15.2 22.4C15.2 23.075 14.65 23.6 14 23.6ZM22 23.6C21.325 23.6 20.8 23.075 20.8 22.4C20.8 21.75 21.325 21.2 22 21.2C22.65 21.2 23.2 21.75 23.2 22.4C23.2 23.075 22.65 23.6 22 23.6ZM24 18.4H20.4V15.6H21.5L24 18.1V18.4Z" fill="white"/>
  </svg>`

  const shipBlueSvgMarkup = `<svg width="35" height="46" viewBox="0 0 35 46" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M34.8108 17.4242C34.8108 27.0474 27.0181 34.8485 17.4054 34.8485C7.79267 34.8485 0 27.0474 0 17.4242C0 7.8011 7.79267 0 17.4054 0C27.0181 0 34.8108 7.8011 34.8108 17.4242Z" fill="#0275D8"/>
  <path d="M17.4054 46L2.33188 26.1364L32.4789 26.1364L17.4054 46Z" fill="#0275D8"/>
  <path d="M22.8757 20.8146L25.0514 18.7749C25.5797 18.2795 25.3622 17.4345 24.6473 17.2306L23.373 16.8518V12.7432C23.373 12.2479 22.9068 11.8108 22.3784 11.8108H20.3892V10.6452C20.3892 10.2664 20.0473 9.94592 19.6433 9.94592H15.1676C14.7324 9.94592 14.4216 10.2664 14.4216 10.6452V11.8108H12.4324C11.873 11.8108 11.4379 12.2479 11.4379 12.7432V16.8518L10.1324 17.2306C9.41758 17.4345 9.20001 18.2795 9.72839 18.7749L11.9041 20.8146C11.3446 22.0967 10.1014 23 8.20542 23C7.77028 23 7.45947 23.3205 7.45947 23.6993V24.1655C7.45947 24.5735 7.77028 24.8648 8.20542 24.8648C10.1014 24.8648 11.5311 24.2821 12.65 23.1457C13.0851 24.1655 14.173 24.8648 15.4162 24.8648H19.3946C20.6068 24.8648 21.6946 24.1655 22.1297 23.1457C23.2487 24.2821 24.6784 24.8648 26.6054 24.8648C27.0095 24.8648 27.3514 24.5735 27.3514 24.1655V23.6993C27.3514 23.3205 27.0095 23 26.6054 23C24.7095 23 23.4351 22.0967 22.8757 20.8146ZM13.427 13.6757H21.3838V16.2398L17.6851 15.1326C17.623 15.1034 17.4676 15.1034 17.4054 15.1034C17.3122 15.1034 17.1568 15.1034 17.0946 15.1326L13.427 16.2398V13.6757Z" fill="white"/>
  </svg>`

  const shipGreenSvgMarkup = `<svg width="35" height="46" viewBox="0 0 35 46" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M34.8108 17.4242C34.8108 27.0474 27.0181 34.8485 17.4054 34.8485C7.79267 34.8485 0 27.0474 0 17.4242C0 7.8011 7.79267 0 17.4054 0C27.0181 0 34.8108 7.8011 34.8108 17.4242Z" fill="#2BC585"/>
  <path d="M17.4054 46L2.33188 26.1364L32.4789 26.1364L17.4054 46Z" fill="#2BC585"/>
  <path d="M22.8757 20.8146L25.0514 18.7749C25.5797 18.2795 25.3622 17.4345 24.6473 17.2306L23.373 16.8518V12.7432C23.373 12.2479 22.9068 11.8108 22.3784 11.8108H20.3892V10.6452C20.3892 10.2664 20.0473 9.94592 19.6433 9.94592H15.1676C14.7324 9.94592 14.4216 10.2664 14.4216 10.6452V11.8108H12.4324C11.873 11.8108 11.4379 12.2479 11.4379 12.7432V16.8518L10.1324 17.2306C9.41758 17.4345 9.20001 18.2795 9.72839 18.7749L11.9041 20.8146C11.3446 22.0967 10.1014 23 8.20542 23C7.77028 23 7.45947 23.3205 7.45947 23.6993V24.1655C7.45947 24.5735 7.77028 24.8648 8.20542 24.8648C10.1014 24.8648 11.5311 24.2821 12.65 23.1457C13.0851 24.1655 14.173 24.8648 15.4162 24.8648H19.3946C20.6068 24.8648 21.6946 24.1655 22.1297 23.1457C23.2487 24.2821 24.6784 24.8648 26.6054 24.8648C27.0095 24.8648 27.3514 24.5735 27.3514 24.1655V23.6993C27.3514 23.3205 27.0095 23 26.6054 23C24.7095 23 23.4351 22.0967 22.8757 20.8146ZM13.427 13.6757H21.3838V16.2398L17.6851 15.1326C17.623 15.1034 17.4676 15.1034 17.4054 15.1034C17.3122 15.1034 17.1568 15.1034 17.0946 15.1326L13.427 16.2398V13.6757Z" fill="white"/>
  </svg>`

  const startClustering = (
    map: any,
    data: HereMapPortData[],
    customClusterTheme: any
  ) => {
    // First we need to create an array of DataPoint objects,
    // for the ClusterProvider
    let dataPoints = data.map(
      item => new window.H.clustering.DataPoint(item.lat, item.lng, null, item)
    )

    // Create a clustering provider with custom options for clusterizing the input
    let clusteredDataProvider = new window.H.clustering.Provider(dataPoints, {
      clusteringOptions: {
        // Maximum radius of the neighbourhood
        eps: 34,
        // minimum weight of points required to form a cluster
        minWeight: 2
      },
      theme: customClusterTheme
    })

    // Create a layer tha will consume objects from our clustering provider
    let clusteringLayer = new window.H.map.layer.ObjectLayer(
      clusteredDataProvider
    )

    // To make objects from clustering provder visible,
    // we need to add our layer to the map
    map.addLayer(clusteringLayer)
  }

  const portIcon = new window.H.map.Icon(portSvgMarkup)
  const roadDepartIcon = new window.H.map.Icon(roadDepartSvgMarkup)
  const roadArriveIcon = new window.H.map.Icon(roadArriveSvgMarkup)
  const airportDepartIcon = new window.H.map.Icon(airportDepartSvgMarkup)
  const airportArriveIcon = new window.H.map.Icon(airportArriveSvgMarkup)
  const shipInPortIcon = new window.H.map.Icon(shipBlueSvgMarkup)
  const shipInMotionIcon = new window.H.map.Icon(shipGreenSvgMarkup)

  useEffect(() => {
    const node = ref.current
    if (node == null) {
      return
    }

    const platform = new window.H.service.Platform({
      apikey: process.env.HERE_KEY,
      useHTTPS: true
    })

    const layers = platform.createDefaultLayers()
    const map = new window.H.Map(node, layers.vector.normal.map, {
      zoom: 2,
      pixelRatio: window.devicePixelRatio || 1
    })
    const ui = window.H.ui.UI.createDefault(map, layers)

    const events = new window.H.mapevents.MapEvents(map)
    new window.H.mapevents.Behavior(events)

    const customClusterTheme = {
      getClusterPresentation: function(cluster: any) {
        let clusterSvgTemplate =
          '<svg xmlns="http://www.w3.org/2000/svg" height="50" width="50">' +
          '<circle cx="25px" cy="25px" r="20" fill="#196fe3" stroke-opacity="0.5;" />' +
          '<text x="24" y="32" font-size="14pt" font-family="arial" font-weight="bold" text-anchor="middle" fill="white">{text}</text>' +
          '</svg>'
        // Use cluster weight to change the icon size
        let weight = cluster.getWeight()
        // Calculate circle size
        let radius = weight * 5

        // Replace variables in the icon template
        let svgString = clusterSvgTemplate.replace(
          /\{radius\}/g,
          radius.toString()
        )
        svgString = clusterSvgTemplate.replace('{text}', `${weight.toString()}`)
        let w
        let h
        if (weight <= 6) {
          w = 35
          h = 35
        } else if (weight <= 12) {
          w = 50
          h = 50
        } else {
          w = 75
          h = 75
        }

        // Create an icon
        // Note that we create a different icon depending from the weight of the cluster
        let clusterIcon = new window.H.map.Icon(svgString, {
            size: { w: w, h: h },
            anchor: { x: w / 2, y: h / 2 }
          }),
          // Create a marker for the cluster
          clusterMarker = new window.H.map.Marker(cluster.getPosition(), {
            icon: clusterIcon,

            // Set min/max zoom with values from the cluster, otherwise
            // clusters will be shown at all zoom levels
            min: cluster.getMinZoom(),
            max: cluster.getMaxZoom()
          })

        // Bind cluster data to the marker
        clusterMarker.setData(cluster)

        return clusterMarker
      },
      getNoisePresentation: function(noisePoint: any) {
        let data = noisePoint.getData()
        // Get a reference to data object our noise points
        // let data = noisePoint.getData(),
        // Create a marker for the noisePoint
        let noiseMarker = new window.H.map.Marker(noisePoint.getPosition(), {
          // Use min zoom from a noise point
          // to show it correctly at certain zoom levels:
          min: noisePoint.getMinZoom(),
          icon:
            shipmentType === ShipmentType.AIR
              ? airportDepartIcon
              : shipmentType === ShipmentType.SEA
              ? shipInPortIcon
              : roadDepartIcon
        })

        // Link a data from the point to the marker
        // to make it accessible inside onMarkerClick
        noiseMarker.setData(
          '<div>' +
            '<div class=tooltip-top>' +
            '<span class=tooltip-name-text>' +
            data.name +
            '</span>' +
            '<span class=tooltip-code-text>' +
            data.code +
            '</span>' +
            '</div>' +
            '<div>'
        )
        noiseMarker.addEventListener('pointerenter', (event: any) => {
          const bubble = new window.H.ui.InfoBubble(
            event.target.getGeometry(),
            {
              content: event.target.getData()
            }
          )
          ui.addBubble(bubble)
        })
        noiseMarker.addEventListener('pointerleave', () => {
          ui.getBubbles().forEach((bubble: any) => ui.removeBubble(bubble))
        })

        return noiseMarker
      }
    }

    let loadingSinglePort
    if (multiplePickupLocations) {
      loadingPort && startClustering(map, loadingPort, customClusterTheme)
    } else {
      loadingSinglePort = loadingPort && loadingPort[0]
    }
    if (dischargePort && dischargePort.lat && dischargePort.lng) {
      if (loadingSinglePort && loadingSinglePort.lat && loadingSinglePort.lng) {
        let midPoint = getMidPointCoOrd(
          loadingSinglePort.lat,
          loadingSinglePort.lng,
          dischargePort.lat,
          dischargePort.lng
        )
        map.setCenter({
          lat: Math.min(loadingSinglePort.lat, dischargePort.lat),
          lng: midPoint[1]
        })
      } else {
        if (
          loadingPort &&
          loadingPort.length > 0 &&
          loadingPort[0].lat &&
          loadingPort[0].lng
        ) {
          let midPoint = getMidPointCoOrd(
            loadingPort[0].lat,
            loadingPort[0].lng,
            dischargePort.lat,
            dischargePort.lng
          )
          map.setCenter({
            lat: loadingPort && Math.min(loadingPort[0].lat, dischargePort.lat),
            lng: midPoint[1]
          })
        }
      }

      if (loadingSinglePort && loadingSinglePort.lat && loadingSinglePort.lng) {
        const portOfLoadingMarker = new window.H.map.Marker(
          { lat: loadingSinglePort.lat, lng: loadingSinglePort.lng },
          shipmentType === ShipmentType.AIR
            ? { icon: airportDepartIcon }
            : shipmentType === ShipmentType.SEA
            ? { icon: portIcon }
            : { icon: roadDepartIcon }
        )
        {
          isDates
            ? portOfLoadingMarker.setData(
                '<div>' +
                  '<div class=tooltip-top>' +
                  '<span class=tooltip-name-text>' +
                  loadingSinglePort.name +
                  '</span>' +
                  '<span class=tooltip-code-text>' +
                  loadingSinglePort.code +
                  '</span>' +
                  '</div>' +
                  '<div>' +
                  '<p>' +
                  'Estimated Time of Departure: ' +
                  '<div class=text-primary>' +
                  (moment(etd).isAfter('0001-01-01') ? moment(etd).format('DD-MM-YYYY') : 'Pending') +
                  '</div>' +
                  '</p>' +
                  '</div>' +
                  '</div>'
              )
            : portOfLoadingMarker.setData(
                '<div class=tooltip-top>' +
                  '<span class=tooltip-name-text>' +
                  loadingSinglePort.name +
                  '</span>' +
                  '<span class=tooltip-code-text>' +
                  loadingSinglePort.code +
                  '</span>' +
                  '</div>'
              )
        }
        portOfLoadingMarker.addEventListener(
          'pointerenter',
          (event: any) => {
            const bubble = new window.H.ui.InfoBubble(
              event.target.getGeometry(),
              {
                content: event.target.getData()
              }
            )
            ui.addBubble(bubble)
          },
          false
        )
        portOfLoadingMarker.addEventListener(
          'pointerleave',
          () => {
            ui.getBubbles().forEach((bubble: any) => ui.removeBubble(bubble))
          },
          false
        )
        map.addObject(portOfLoadingMarker)
      }

      if (dischargePort && dischargePort.lat && dischargePort.lng) {
        const portOfDischargeMarker = new window.H.map.Marker(
          { lat: dischargePort.lat, lng: dischargePort.lng },
          shipmentType === ShipmentType.AIR
            ? { icon: airportArriveIcon }
            : shipmentType === ShipmentType.SEA
            ? { icon: shipInPortIcon }
            : { icon: roadArriveIcon }
        )
        {
          isDates
            ? portOfDischargeMarker.setData(
                '<div>' +
                  '<div class=tooltip-top>' +
                  '<span class=tooltip-name-text>' +
                  dischargePort.name +
                  '</span>' +
                  ' ' +
                  '<span class=tooltip-code-text>' +
                  dischargePort.code +
                  '</span>' +
                  '</div>' +
                  '<p>' +
                  'Estimated Time of Arrival: ' +
                  '<div class=text-primary>' +
                  (moment(eta).isAfter('0001-01-01') ? moment(eta).format('DD-MM-YYYY') : 'Pending') +
                  '</div>' +
                  '</p>' +
                  '</div>'
              )
            : portOfDischargeMarker.setData(
                '<div class=tooltip-top>' +
                  '<span class=tooltip-name-text>' +
                  dischargePort.name +
                  '</span>' +
                  ' ' +
                  '<span class=tooltip-code-text>' +
                  dischargePort.code +
                  '</span>' +
                  '</div>'
              )
        }
        portOfDischargeMarker.addEventListener(
          'pointerenter',
          (event: any) => {
            const bubble = new window.H.ui.InfoBubble(
              event.target.getGeometry(),
              {
                content: event.target.getData()
              }
            )
            ui.addBubble(bubble)
          },
          false
        )
        portOfDischargeMarker.addEventListener(
          'pointerleave',
          () => {
            ui.getBubbles().forEach((bubble: any) => ui.removeBubble(bubble))
          },
          false
        )
        map.addObject(portOfDischargeMarker)
      }

      if (vessel && vessel.length > 0) {
        map.setCenter({ lat: vessel[0].latitude, lng: vessel[0].longitude })
        const shipMarker = new window.H.map.Marker(
          { lat: vessel[0].latitude, lng: vessel[0].longitude },
          { icon: vessel[0].speed > 0 ? shipInMotionIcon : shipInPortIcon }
        )
        shipMarker.setData(
          '<div>' +
            '<div class=tooltip-top>' +
            '<span class=tooltip-name-text>' +
            vessel[0].name +
            '</span>' +
            '<span class=tooltip-code-text>' +
            vessel[0].zone +
            '</span>' +
            '</div>' +
            '<div>' +
            '<p>' +
            'Estimated Time of Arrival: ' +
            '<p class=text-primary>' +
            moment(vessel[0].eta).format('DD-MM-YYYY') +
            '</p>' +
            '</p>' +
            '</div>' +
            '</div>'
        )
        shipMarker.addEventListener(
          'pointerenter',
          (event: any) => {
            const bubble = new window.H.ui.InfoBubble(
              event.target.getGeometry(),
              {
                content: event.target.getData()
              }
            )
            ui.addBubble(bubble)
          },
          false
        )
        shipMarker.addEventListener(
          'pointerleave',
          () => {
            ui.getBubbles().forEach((bubble: any) => ui.removeBubble(bubble))
          },
          false
        )
        map.addObject(shipMarker)
      } else {
        if (
          shipmentType === ShipmentType.SEA &&
          loadingSinglePort &&
          loadingSinglePort.lat &&
          loadingSinglePort.lng
        ) {
          let midPoint = getMidPointCoOrd(
            loadingSinglePort.lat,
            loadingSinglePort.lng,
            dischargePort.lat,
            dischargePort.lng
          )
          map.setCenter({
            lat: Math.min(loadingSinglePort.lat, dischargePort.lat),
            lng: midPoint[1]
          })
        }
      }
    }

    return () => {
      while (node.firstChild) {
        node.firstChild.remove()
      }
    }
  }, [loadingPort, dischargePort, vessel])

  return <div className='w-100 h-100' ref={ref} />
}

export default HereMap
