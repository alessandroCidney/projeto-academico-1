import { useArticlesService } from './useArticlesService'

export function useNewsService () {
  const articlesService = useArticlesService('news')

  return articlesService
}
