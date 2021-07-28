import { setters } from '../services'

export function syncFromList (list) {
  return setters.setArray('form_listas_itens', list)
}
