export function useRules () {
  return {
    required (value?: string | null) {
      return !!value || 'Campo obrigatório'
    },

    email (value?: string | null) {
      const emailRegExp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i

      return (!!value && emailRegExp.test(value)) || 'E-mail inválido'
    },

    strongPassword (value?: string | null) {
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

      return (!!value && strongPasswordRegex.test(value)) || 'Pelo menos 8 caracteres, contendo letras maiúsculas e minúsculas, números e caracteres especiais'
    },

    valuesAreEqual (basePropertyValue?: string | null) {
      return (newPropertyValue?: string | null) => {
        return newPropertyValue === basePropertyValue || 'Os valores devem ser iguais'
      }
    },

    maxLength (max: number) {
      return (value?: string | null) => {
        return (!!value && value.length <= max) || `No máximo ${max} caracteres`
      }
    },
  }
}
