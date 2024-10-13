function generateFakeArray () {
  return [1, 2, 3, 4, 5, 6, 7].map(index => ({
    _id: `exampleuser1${index}`,
    displayName: `Example User ${index}`,
    imageUrl: 'https://cdn.pixabay.com/photo/2023/10/29/14/37/pumpkins-8350480_1280.jpg',
  }))
}

export function useUsersService () {
  return {
    async list () {
      return generateFakeArray()
    },

    async get (articleId: string) {
      return generateFakeArray().find(article => article._id === articleId)
    },
  }
}
