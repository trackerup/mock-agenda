/**
 * See more in https://router.vuejs.org/en/advanced/scroll-behavior.html
 *
 * @param {Object}  to  Reference position initial
 * @param {Object}  from  Reference position final
 * @param {Object}  savedPosition The position saved
 *
 * @returns {Object} Return position
 */
export function scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  }

  let position = {}

  if (to.matched.length < 2) {
    position = { x: 0, y: 0 }
  } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
    position = { x: 0, y: 0 }
  }
  if (to.hash) {
    position = { selector: to.hash }
  }

  return position
}

/**
 * Verify if the object is empty
 *
 * @param {Object} obj  Object to verify
 * @returns {Boolean} Return true if the object is empty
 */
export function empty (obj) {
  return !obj || obj.length == 0
}

/**
 * Method similar the range in python
 *
 * @param  {Integer} start First position of array
 * @param  {Integer} end  Last posisiton of arry
 * @returns {Array} Return a array with start - end length
 */
export function range (start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx)
}

/**
 * Returns the base number according to the accuracy
 *
 * @param {Date|Number} d A date
 * @returns {Boolean} Return true if is a valid date
 * */
export function isValidDate (d) {
  return d instanceof Date && !isNaN(d)
}

/**
 * Returns a list of ordered objects
 *
 * @param {Array} list Array list of data
 * @param {String} key Key name inside of object
 * @param {Boolean} desc Flag to sort descending or ascending
 * @returns {Array} Returns an ordered list
 * */
export function sortObjectListByKey (list, key, desc = false) {
  return list.sort((a, b) => {
    if (desc) return a[key] < b[key] ? 1 : a[key] > b[key] ? -1 : 0
    else return a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0
  })
}

/**
 * Returns an unique list of objects according to key
 *
 * @param {Array} list Array list of data
 * @param {String} key Key name inside of object
 * @returns {Array} Returns an unique list of object
 * */
export function uniqueByKey (list, key) {
  return list.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[key]).indexOf(obj[key]) == pos
  })
}

/**
 * Returns a test of RegExp test if the search like in the value
 *
 * @param {string} search Value of "SQL" like for test
 * @param {string} value String to be tested
 * @returns {boolean} Returns like test
 * */
export function like (search, value) {
  if (typeof search != 'string' || value == null) {
    return false
  }
  // Remove special chars
  search = search.replace(new RegExp('([\\.\\\\\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:\\-])', 'g'), '\\$1')
  // Replace % and _ with equivalent regex
  search = search.replace(/%/g, '.*').replace(/_/g, '.')
  // Check matches
  return RegExp('^' + search + '$', 'gi').test(value)
}
/**
 * Returns an object with values parse
 *
 * @param {Object} obj Object to change values
 * @returns {Array} Returns an object with values parse
 * */
export function jsonValuesToJson (obj) {
  let z = {}
  Object.keys(obj).forEach(key => {
    try {
      z[key] = JSON.parse(obj[key])
    } catch (e) {
      z[key] = obj[key]
    }
  })
  return z
}

/**
 * Returns a check if the exists key in object
 *
 * @param {Object} obj Object to change values
 * @param {String} key Key of object to check
 * @returns {Boolean} Returns true if object contains the key
 * */
export function objectKeyExists (obj, key) {
  return key in obj
}

/**
 * Returnsa n object that keys no exists in object
 *
 * @param {Object} obj Object to change values
 * @param {Array} keys An array of keys
 * @returns {Array} Returns an object with keys not presents
 * */
export function checkKeysOfObjectExists (obj, keys) {
  let keysNotPresent = []
  keys.forEach(key => {
    if (!objectKeyExists(obj, key)) {
      keysNotPresent.push(key)
    }
  })
  return keysNotPresent
}

/**
 * Returns a clone of source object.
 *
 * @param {Object} src Source object.
 * @returns {Object} Returns a object clone.
 * */
export function cloneObject (src) {
  return Object.assign({}, src)
}

/**
 * Returns a clone of source object.
 *
 * @param {Array} arrayItems Array of items.
 * @param {Object} item The object with id key.
 * @returns {Object} Returns a object.
 * */
export function existsInArray (arrayItems, item) {
  return arrayItems.find(arrayItem => arrayItem.id == item.id)
}

/**
 * Returns a string from json object
 *
  * @param {Object} currentValue The object with the value.
  * @param {String} mask The filed mask.
 * @returns {String} Returns a String.
 * */
export function jsonValueToString (currentValue, mask) {
  var resp = ''
  if (currentValue == null) {
    return ''
  }
  if (typeof currentValue == 'string') {
    try {
      let newValue = JSON.parse(currentValue)
      currentValue = newValue
    } catch (error) {
      return currentValue
    }
  }
  var listGroupNames = mask.split('.')

  var actualValue = currentValue
  var oldStatus = actualValue
  var actualName = getNameValue(actualValue, listGroupNames)
  while (actualName) {
    if (actualName != ' ' && actualName != null) {
      resp += actualName + ' > \n'
    }
    oldStatus = actualValue
    actualValue = actualValue.value
    actualName = getNameValue(actualValue, listGroupNames)
  }
  resp += oldStatus.descricao
  return currentValue ? resp : ''
}

export function getNameValue (treeObject, listGroupNames) {
  if (treeObject['name']) {
    if (listGroupNames.includes(treeObject['name'])) {
      return ' '
    } else {
      return treeObject['descricao']
    }
  } else {
    return false
  }
}

export function waitForCordovaReady () {
  return new Promise(async (resolve, reject) => {
    while (!window.cordovaIsReady) {
      await new Promise(async (resolve, reject) => {
        setTimeout(() => { resolve() }, 100)
      })
    }
    resolve()
  })
}
