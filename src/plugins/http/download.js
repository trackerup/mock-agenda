export function download (url, name) {
  return new Promise((resolve, reject) => {
    if (typeof window.rootFS != 'undefined' && window.rootFS != false && name) {
      window.rootFS.getFile(
        name, {
          create: true,
          exclusive: false
        },
        (fileEntry) => {
          fileEntry.getMetadata(function (metadata) {
            if (metadata.size == 0 ||
              ((new Date().getTime() - metadata.modificationTime.getTime()) / 1000 / 60 / 60 / 24) >= 1) {
              getFileFromUrl(url).then(result => {
                fileEntry.createWriter(writer => {
                  writer.onwrite = function (evt) {
                    resolve(result)
                  }
                  writer.write(result)
                })
              }).catch(error => {
                reject(error)
              })
            } else {
              resolve(fileEntry)
            }
          },
          function (error) {
            reject(error)
          })
        },
        function (error) {
          reject(error)
        }
      )
    } else {
      // Just get content as a text
      getFileFromUrl(url).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    }
  })
}

function getFileFromUrl (url) {
  return new Promise((resolve, reject) => {
    var oReq = new XMLHttpRequest()
    // Make sure you add the domain name to the Content-Security-Policy <meta> element.
    oReq.open('GET', url, true)
    // Define how you want the XHR data to come back
    oReq.responseType = 'blob'
    oReq.onload = function (oEvent) {
      var blob = oReq.response // Note: not oReq.responseText
      if (blob) {
        // Or read the data with a FileReader
        var reader = new FileReader()
        reader.addEventListener('loadend', function () {
          resolve(reader.result)
        }, error => {
          reject(error)
        })
        reader.readAsText(blob)
      } else reject(blob)
    }
    oReq.send(null)
  })
}

export function loadFile (arquivo) {
  return new Promise((resolve, reject) => {
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem
    window.requestFileSystem(1, 0, function onFileSystemSuccess (fileSystem) {
      fileSystem.root.getFile(arquivo, null, function gotFileEntry (fileEntry) {
        fileEntry.file(function (file) {
          var reader = new FileReader()
          reader.onloadend = function (evt) {
            try {
              let jsonDownload = JSON.parse(evt.target.result)
              resolve(jsonDownload)
            } catch (e) {
              deleteFile(arquivo).then(result => {
                reject(e)
              })
            }
          }
          reader.readAsText(file)
        },
        function (error) {
          reject(error)
        })
      },
      function (error) {
        reject(error)
      })
    },
    function (error) {
      reject(error)
    })
  })
}
export function deleteFile (arquivo) {
  return new Promise((resolve, reject) => {
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem
    window.requestFileSystem(
      1,
      0,
      function onFileSystemSuccess (fileSystem) {
        fileSystem.root.getFile(
          arquivo,
          null,
          function gotFileEntry (fileEntry) {
            if (fileEntry.isFile) {
              fileEntry.remove(
                function (entry) {
                  resolve(entry)
                },
                function (error) {
                  reject(error)
                })
            }
          },
          function (error) {
            reject(error)
          })
      },
      function (error) {
        reject(error)
      })
  })
}

export function getFile (arquivo, callback) {
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem
  window.requestFileSystem(
    1,
    0,
    function onFileSystemSuccess (fileSystem) {
      fileSystem.root.getFile(
        arquivo,
        null,
        function gotFileEntry (fileEntry) {
          fileEntry.file(
            function (file) {
              var reader = new FileReader()
              reader.onloadend = function (evt) {
                console.log('Read as JSON ' + arquivo)
                if (typeof callback == 'function') {
                  callback(evt.target.result)
                } else {
                  window.jsonDownload = JSON.parse(evt.target.result)
                }
              }
              reader.readAsText(file)
            },
            function (error) {
              console.log(error)
            }
          )
        },
        function (error) {
          console.log(error)
        }
      )
    },
    function (error) {
      console.log(error)
    }
  )
}
