'use server'

import { sessionUser } from '@/app/(frontend)/(auth)/_lib/auth'
import { getPayload } from '@/lib/payload'
import { COLLECTION_SLUG_SESSIONS } from '@/collections/slugs'
import { User } from '@/payload-types'

export const deleteSession = async (sessionId: string | number, isTopicSuggestion = false) => {
  const user = await sessionUser();

  if (!user) {
    throw new Error('User not found')
  }

  const payload = await getPayload()
  const session = await payload.findByID({
    collection: COLLECTION_SLUG_SESSIONS,
    id: sessionId,
  })

  if(!session) {
    throw new Error('Session not found')
  }

  const presenters = session.presenters as User[]
  const suggestedBy = session.suggestedBy as User
  if(!isTopicSuggestion && presenters.some(presenter => presenter.id !== user.id)) {
    throw new Error('User is not a presenter')
  }
  if(isTopicSuggestion && suggestedBy.id !== user.id) {
    throw new Error('User is not the topic suggestion')
  }

  return await payload.delete({
    collection: COLLECTION_SLUG_SESSIONS,
    id: sessionId,
  })
}
