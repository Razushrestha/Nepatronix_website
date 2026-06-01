export type CertificateGender = 'male' | 'female' | 'other'

export interface CertificatePronouns {
  subject: string
  possessive: string
  object: string
}

const PRONOUNS: Record<CertificateGender, CertificatePronouns> = {
  male: { subject: 'he', possessive: 'his', object: 'him' },
  female: { subject: 'she', possessive: 'her', object: 'her' },
  other: { subject: 'he or she', possessive: 'his or her', object: 'him or her' },
}

export function normalizeCertificateGender(value: unknown): CertificateGender {
  if (value === 'male' || value === 'female' || value === 'other') {
    return value
  }
  return 'other'
}

export function getCertificatePronouns(gender: unknown): CertificatePronouns {
  return PRONOUNS[normalizeCertificateGender(gender)]
}

export function buildCertificateParticipationParagraph(pronouns: CertificatePronouns): string {
  return (
    `During the workshop, ${pronouns.subject} demonstrated enthusiasm for learning and a keen interest in ` +
    `electronics and innovation. We appreciate ${pronouns.possessive} active participation and ` +
    `encourage ${pronouns.object} to continue exploring technology and innovation to create meaningful ` +
    `impact in society and contribute to the nation's development.`
  )
}
