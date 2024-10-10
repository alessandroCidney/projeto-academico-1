function generateFakeArray () {
  return [1, 2, 3, 4, 5, 6, 7].map(index => ({
    _id: `artigo-${index}`,
    title: `Artigo ${index}`,
    description: `Esta é a descrição da Artigo ${index}.`,
    imageUrl: 'https://cdn.pixabay.com/photo/2023/10/29/14/37/pumpkins-8350480_1280.jpg',
    content: 'Este é o conteúdo do artigo',
    tags: ['Tag 01', 'Tag 02'],
  }))
}

export function useArticlesService () {
  return {
    async list () {
      return generateFakeArray()
    },

    async get (articleId: string) {
      return generateFakeArray().find(article => article._id === articleId)
    },
  }
}
