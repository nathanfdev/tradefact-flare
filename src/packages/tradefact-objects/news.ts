export interface NewsContentItem {
  seqNo: number
  newsItem: string
}

export interface NewsContent {
  items: NewsContentItem[]
  reference: string
  weekNo: number
  title: string
}
