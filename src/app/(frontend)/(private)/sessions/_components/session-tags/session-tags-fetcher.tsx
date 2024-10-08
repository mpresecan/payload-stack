import React from 'react'
import SessionTagsClient from '@/app/(frontend)/(private)/sessions/_components/session-tags/session-tags.client'
import { getTags } from '@/app/(frontend)/(private)/sessions/_lib/get-tags'


const SessionTagFetcher = async () => {
  const tags = await getTags()

  return (
    <SessionTagsClient tags={tags} />
  )
}

export default SessionTagFetcher
