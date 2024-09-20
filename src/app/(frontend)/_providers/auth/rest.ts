import type { User } from '@/payload-types'
import { ActionResultType } from '@/app/(frontend)/auth/auth'

export const rest = async (
  url: string,
  args?: any,
  options?: RequestInit,
): Promise<User | null | undefined> => {
  const method = options?.method || 'POST'

  try {
    const res = await fetch(url, {
      method,
      ...(method === 'POST' ? { body: JSON.stringify(args) } : {}),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    const { errors, user } = await res.json()

    if (errors) {
      throw new Error(errors[0].message)
    }

    if (res.ok) {
      return user
    }
  } catch (e: unknown) {
    throw new Error(e as string)
  }
}
