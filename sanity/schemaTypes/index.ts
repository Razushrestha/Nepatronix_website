// Schemas
import { teamMember } from './teamMember'
import { partner } from './partner'
import { testimonial } from './testimonial'
import { recognition } from './recognition'
import { post } from './post'
import { service } from './service'
import { mentor } from './mentor'
import { school } from './school'
import { gallery } from './gallery'
import { footer } from './footer'
import { contact } from './contact'
import subscriber from './subscriber'

export const schema = {
  types: [teamMember, partner, testimonial, recognition, post, service, mentor, school, gallery, footer, contact, subscriber],
}
