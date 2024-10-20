export class FirestoreLike {
  authorId = ''
  createdAt = ''
}

export class FirestoreComment {
  _id = ''
  authorId = ''
  createdAt = ''
  content = ''
  removed = false
}

export class FirestoreArticle {
  _id = ''
  title = ''
  description = ''
  content = ''
  imagePath = ''
  imageUrl = ''
  tags: string[] = []
  authorId = ''
  createdAt = ''
  updatedAt = ''
}
