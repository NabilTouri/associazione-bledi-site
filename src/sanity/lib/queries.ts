import { defineQuery } from 'next-sanity'

/**
 * Translated fields are stored as `{it, ar, fr}` objects.
 * `coalesce(field[$locale], field.it)` falls back to Italian when a
 * translation is missing.
 */

const postFields = /* groq */ `
  _id,
  "title": coalesce(title[$locale], title.it),
  "slug": slug.current,
  kind,
  pinned,
  publishedAt,
  "excerpt": coalesce(excerpt[$locale], excerpt.it),
  cover
`

const eventFields = /* groq */ `
  _id,
  "title": coalesce(title[$locale], title.it),
  "slug": slug.current,
  start,
  end,
  locationName,
  address,
  "excerpt": coalesce(excerpt[$locale], excerpt.it),
  cover,
  isFree
`

export const siteSettingsQuery = defineQuery(`*[_id == "siteSettings"][0]{
  "title": coalesce(title[$locale], title.it),
  "tagline": coalesce(tagline[$locale], tagline.it),
  "description": coalesce(description[$locale], description.it),
  email,
  phone,
  address,
  mapQuery,
  location,
  social[]{platform, url},
  runtsStatus,
  runtsNumber,
  fiscalCode,
  iban,
  donationsEnabled,
  membershipFee
}`)

export const homePageQuery = defineQuery(`*[_id == "homePage"][0]{
  "eyebrow": coalesce(eyebrow[$locale], eyebrow.it),
  "heroTitle": coalesce(heroTitle[$locale], heroTitle.it),
  "heroSubtitle": coalesce(heroSubtitle[$locale], heroSubtitle.it),
  heroImage,
  "aboutTitle": coalesce(aboutTitle[$locale], aboutTitle.it),
  "aboutText": coalesce(aboutText[$locale], aboutText.it),
  "pillars": pillars[]{
    "title": coalesce(title[$locale], title.it),
    "text": coalesce(text[$locale], text.it)
  },
  "joinTitle": coalesce(joinTitle[$locale], joinTitle.it),
  "joinText": coalesce(joinText[$locale], joinText.it)
}`)

const card = (name: string) => /* groq */ `"${name}": {
    "title": coalesce(${name}.title[$locale], ${name}.title.it),
    "text": coalesce(${name}.text[$locale], ${name}.text.it)
  }`

export const donatePageQuery = defineQuery(`*[_id == "donatePage"][0]{
  "demoTitle": coalesce(demoTitle[$locale], demoTitle.it),
  "demoText": coalesce(demoText[$locale], demoText.it),
  "impact": {
    "10": coalesce(impact.amount10[$locale], impact.amount10.it),
    "25": coalesce(impact.amount25[$locale], impact.amount25.it),
    "50": coalesce(impact.amount50[$locale], impact.amount50.it),
    "100": coalesce(impact.amount100[$locale], impact.amount100.it)
  },
  ${card('bank')},
  ${card('fiveXMille')},
  ${card('tax')},
  ${card('volunteer')}
}`)

export const transparencyPageQuery = defineQuery(`*[_id == "transparencyPage"][0]{
  "runtsTitle": coalesce(runtsTitle[$locale], runtsTitle.it),
  "runtsText": coalesce(runtsText[$locale], runtsText.it),
  "planned": planned[defined(label.it)]{
    "label": coalesce(label[$locale], label.it),
    "done": coalesce(done, false)
  }
}`)

export const aboutPageQuery = defineQuery(`*[_id == "aboutPage"][0]{
  "intro": coalesce(intro[$locale], intro.it),
  "mission": coalesce(mission[$locale], mission.it),
  "story": coalesce(story[$locale], story.it),
  "values": values[]{
    "title": coalesce(title[$locale], title.it),
    "text": coalesce(text[$locale], text.it)
  },
  image
}`)

export const postsQuery = defineQuery(`*[_type == "post" && defined(slug.current)]
  | order(pinned desc, publishedAt desc)[0...$limit]{${postFields}}`)

export const postBySlugQuery = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  ${postFields},
  "body": coalesce(body[$locale], body.it)
}`)

export const postSlugsQuery = defineQuery(`*[_type == "post" && defined(slug.current)].slug.current`)

export const upcomingEventsQuery = defineQuery(`*[_type == "event" && defined(slug.current)
  && dateTime(coalesce(end, start)) >= dateTime(now())]
  | order(start asc)[0...$limit]{${eventFields}}`)

export const pastEventsQuery = defineQuery(`*[_type == "event" && defined(slug.current)
  && dateTime(coalesce(end, start)) < dateTime(now())]
  | order(start desc)[0...$limit]{${eventFields}}`)

export const eventBySlugQuery = defineQuery(`*[_type == "event" && slug.current == $slug][0]{
  ${eventFields},
  "body": coalesce(body[$locale], body.it),
  registrationUrl
}`)

export const eventSlugsQuery = defineQuery(`*[_type == "event" && defined(slug.current)].slug.current`)

export const activitiesQuery = defineQuery(`*[_type == "activity"] | order(order asc, _createdAt asc){
  _id,
  "title": coalesce(title[$locale], title.it),
  "category": coalesce(category[$locale], category.it),
  status,
  "schedule": coalesce(schedule[$locale], schedule.it),
  "description": coalesce(description[$locale], description.it),
  image
}`)

export const boardMembersQuery = defineQuery(`*[_type == "boardMember"] | order(order asc, name asc){
  _id,
  name,
  "role": coalesce(role[$locale], role.it),
  photo
}`)

export const galleryAlbumsQuery = defineQuery(`*[_type == "galleryAlbum" && defined(slug.current)] | order(date desc){
  _id,
  "title": coalesce(title[$locale], title.it),
  "slug": slug.current,
  date,
  "cover": coalesce(cover, images[0]),
  "count": count(images)
}`)

export const galleryAlbumBySlugQuery = defineQuery(`*[_type == "galleryAlbum" && slug.current == $slug][0]{
  _id,
  "title": coalesce(title[$locale], title.it),
  "slug": slug.current,
  date,
  "description": coalesce(description[$locale], description.it),
  "cover": coalesce(cover, images[0]),
  "count": count(images),
  images[]{..., "caption": coalesce(caption[$locale], caption.it)}
}`)

export const transparencyDocumentsQuery = defineQuery(`*[_type == "transparencyDocument"] | order(year desc, _createdAt desc){
  _id,
  "title": coalesce(title[$locale], title.it),
  kind,
  year,
  "fileUrl": file.asset->url
}`)

export const legalPageQuery = defineQuery(`*[_type == "legalPage" && slug.current == $slug][0]{
  "title": coalesce(title[$locale], title.it),
  "body": coalesce(body[$locale], body.it)
}`)
