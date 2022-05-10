import { User } from './all'

export enum RoomType {
  PrivateGroup = 'p',
  PrivateGroup2 = 'g',
  DirectMessage = 'd',
  Channel = 'c'
}

export interface Reaction {
  name: string
  usernames: string[]
}

export interface Attachment {
  authorIcon: string
  authorName: string
  color: string
  imageUrl: string
  text: string
  thumbUrl: string
  timestamp: string
  title: string
  titleLink: string
  titleLinkDownloadable: boolean
}

export interface Message {
  id: string
  isActive: boolean
  creationDateInternal: string
  lastChangeUser: string
  lastModifiedOn: string
  lastModifiedOnInternal: string
  attachments: Attachment[]
  comment: string
  isPinned: boolean
  pinnedAt: string
  pinnedBy: User
  reactions: Reaction[]
  roomId: string
  starred: User[]
  type: string
  userId: string
  wasEdited: boolean
  postedBy: {
    avatar: string
    displayName: string
  }
}

export interface Room {
  id: string
  isActive: boolean
  creationDateInternal: string
  lastChangeUser: string
  lastModifiedOn: string
  lastModifiedOnInternal: string
  isAlert: boolean
  isOpen: boolean
  messages: Message[]
  name: string
  type: RoomType
  unreadCount: number
}
