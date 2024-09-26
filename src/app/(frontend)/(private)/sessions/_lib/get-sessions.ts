import 'server-only'
import { SessionTabs, SortBy } from '../types/params'
import { getPayload } from '@/lib/payload'
import { Session, User } from '@/payload-types'
import { COLLECTION_SLUG_SESSIONS } from '@/collections/slugs'
import { JoinQuery, PaginatedDocs, Where } from 'payload'

interface GetSessionsParams {
  s?: string,
  tab?: SessionTabs,
  past?: boolean,
  sortBy?: SortBy,
  tags?: string,
  onSiteId?: string
}

const getCorrectSearchParams = (params: GetSessionsParams, user?: User) => {
  const { s, tab, past, sortBy, tags, onSiteId } = params

  const search = s ? s : ''
  const queryPast = past ? past : false
  const sessionTab = tab ? ((['proposals', 'scheduled'].includes(tab) && queryPast) || ((!user || onSiteId) && ['interested', 'my-sessions'].includes(tab)) ? 'all' : tab) : 'all'
  const sort = sortBy ? sortBy : 'popularity'
  const selectedTags = tags ? tags.split(',') : []

  return {
    s: search,
    tab: sessionTab,
    past: queryPast,
    sortBy: sort,
    tags: selectedTags,
    onSiteId,
  }
}

export const getSessionsBySearchParams = async (params: GetSessionsParams, user?: User) => {
  const { s, tab, past, sortBy, tags, onSiteId } = getCorrectSearchParams(params, user)

  console.log('s:', s)
  console.log('tab:', tab)
  console.log('past:', past)
  console.log('sortBy:', sortBy)
  console.log('tags:', tags)
  console.log('onSiteId:', onSiteId)
  console.log('-------------------')

  const where : Where = {
    and: [
      {
        title: {
          like: s,
        }
      },
      {
        type: {
          equals: onSiteId ? 'onsite' : 'online',
        }
      }
    ]
  }

  if(tab === 'my-sessions' && user) {
    where.and = where.and || []; // un necessary, just for the sake of typescript
    where.and.push({
      presenters: {
        in: user.id,
      }
    })
  }

  // for onsite events
  if(onSiteId) {
    where.and = where.and || []; // un necessary, just for the sake of typescript
    where.and.push({
      onSiteEvent: {
        equals: onSiteId,
      }
    })
  }

  const joins : JoinQuery = {
    interestedUsers: {
      limit: 999999,
    }
  }

  // const sort = interestedUsers


  try {
    const payload = await getPayload();

    return await payload.find({
      collection: COLLECTION_SLUG_SESSIONS,
      where,
      joins,
      depth: 0,
    })

  } catch (e) {
    console.error('Error getting sessions:', e)
  }

  return {
    docs: [],
    totalDocs: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  } as PaginatedDocs<Session>
}
