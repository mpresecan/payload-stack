'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDownIcon, ChevronUpIcon, TagIcon } from 'lucide-react'
import { SessionEvent, SessionInterestedAttendee, SessionTag, User } from '@/payload-types'
import Presenters from './presenters'
import StatusBadge from '@/app/(frontend)/(private)/_components/status-badge'
import InterestComponent from '@/app/(frontend)/(private)/_components/interest-component'
import { Link } from 'next-view-transitions'
import SuggestedBy from '@/app/(frontend)/(private)/sessions/_components/session-item/sugessted-by'

const SessionComponent = ({ session, currentUser }: { session: SessionEvent, currentUser?: User | null | undefined }) => {

  const [showMore, setShowMore] = useState(false)

  const voters: User[] = session.interestedUsers?.docs?.map(voter => (voter as SessionInterestedAttendee).user as User) || []
  const tags: SessionTag[] = session.tags.map(tag => tag as SessionTag)

  return (
    <Card className="overflow-visible mb-4" style={{ viewTransitionName: `card-session-${session.id}` }}>
      <CardContent className="p-4">
        <div className="flex flex-wrap justify-between items-start mb-2">
          <div>
            <Link href={session.status === 'wished' ? `/suggested-topic/${session.id}` : `/session/${session.id}`}>
              <h2 className="text-lg font-semibold"
                  style={{ viewTransitionName: `session-title-${session.id}` }}>{session.title}</h2>
            </Link>
            {session.status !== 'wished' && <Presenters presenters={session.presenters} styles={{ viewTransitionName: `session-presenters-${session.id}` }} />}
            {session.status === 'wished' && <SuggestedBy suggestedBy={session.suggestedBy} styles={{ viewTransitionName: `session-suggested-by-${session.id}` }} />}
          </div>
          <StatusBadge status={session.status} scheduledAt={session.scheduledAt}
                       styles={{ viewTransitionName: `session-status-badge-${session.id}` }} />
        </div>
        <div className="relative z-10">
          <InterestComponent session={session} refetchSessions={true} user={currentUser} />
        </div>
        <div className="mt-2 relative z-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={`description-${session.id}`}
              initial="collapsed"
              animate={showMore ? 'expanded' : 'collapsed'}
              exit="collapsed"
              variants={{
                expanded: { height: 'auto', opacity: 1 },
                collapsed: { height: '2.5em', opacity: 1 },
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="relative overflow-hidden"
            >
              <p className="text-sm text-muted-foreground"
                 style={{ viewTransitionName: `session-short-description-${session.id}` }}>
                {session.shortDescription}
              </p>
              {!showMore && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent" />
              )}
            </motion.div>
          </AnimatePresence>
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 p-0 h-auto text-muted-foreground hover:text-foreground"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? (
              <>
                Read less
                <ChevronUpIcon className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Read more
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 bg-muted/50">
        <div className="flex items-center text-xs text-muted-foreground">
          <TagIcon className="mr-2 h-3 w-3" />
          {tags.map((tag, index) => (
            <span key={index} className="mr-2">
              {tag.name}{index < tags.length - 1 ? ',' : ''}
            </span>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

export default SessionComponent
