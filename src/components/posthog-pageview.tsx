// app/PostHogPageView.tsx
'use client'

import { usePathname, useSearchParams } from "next/navigation";
import { usePostHog } from 'posthog-js/react';
import React, {Suspense, useEffect} from "react";

function PostHogView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  useEffect(() => {
    // Track page views
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture(
        '$pageview',
        {
          '$current_url': url,
        },
      )
    }
  }, [pathname, searchParams, posthog])

  return null
}

export default function PostHogPageView() {
  return (
    <Suspense>
      <PostHogView />
    </Suspense>
  )
}
