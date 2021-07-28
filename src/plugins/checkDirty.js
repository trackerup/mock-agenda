
window.checkDirty = function () {
  let elements = document.getElementsByClassName('mdl-textfield')
  for (let idxElement in elements) {
    if (elements.hasOwnProperty(idxElement)) {
      if (elements[idxElement].MaterialTextfield) {
        elements[idxElement].MaterialTextfield.checkDirty()
      }
    }
  }
}
