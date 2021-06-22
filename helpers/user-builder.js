export const userBuilder = (data) => {
  const {
    id,
    uid,
    email,
    displayName,
    slug,
    photoUrl,
    bio,
    linkedin,
    github,
    instagram,
    youtube,
    followers,
    followings,
    nbPosts,
    nbFollowers,
    nbFollowings,
  } = data

  return {
    id,
    uid,
    email,
    displayName,
    slug,
    photoUrl: photoUrl ?? '',
    bio: bio ?? '',
    linkedin: linkedin ?? '',
    github: github ?? '',
    instagram: instagram ?? '',
    youtube: youtube ?? '',
    followers: followers ?? [],
    followings: followings ?? [],
    nbPosts: nbPosts ?? 0,
    nbFollowers: nbFollowers ?? 0,
    nbFollowings: nbFollowings ?? 0,
  }
}
