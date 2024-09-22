import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { COLLECTION_SLUG_USERS } from '@/collections/slugs'
import { VerificationEmail } from '@/app/(frontend)/auth/_components/emails/verification-email'
import { render } from '@react-email/render'

const Users: CollectionConfig = {
  slug: COLLECTION_SLUG_USERS,
  access: {
    admin: authenticated,
    create: () => true,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: {
    verify: {
      generateEmailHTML: ({ token, user}) => {
        return render(VerificationEmail({emailVerificationToken: token, user}))
      }
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: false,
      saveToJWT: true,
    },
    {
      name: 'role',
      type: 'select',
      options: ['user', 'admin'],
      defaultValue: 'user',
      required: true,
      saveToJWT: true,
    }
  ],
  timestamps: true,
}

export default Users
