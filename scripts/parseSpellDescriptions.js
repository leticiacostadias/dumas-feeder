const pdfParser = require('pdf-parser')
const fs = require('fs')

const pdfPath = './../src/spell-descriptions.pdf'

function save(json) {
  fs.writeFile('./../output/spell-descriptions.json', JSON.stringify(json, null, '\t'), (error) => {
    if (error) {
      console.error(error)
    } else {
      console.log('Done')
    }
  })
}


pdfParser.pdf2json(pdfPath, (err, pdf) => {
  if (err) {
    console.error(err)
    return
  }

  const parsedPdf = {}

  parsedPdf.pages = pdf.pages
    .filter((page) => page.texts.length > 1)
    .sort((a, b) => a.pageId - b.pageId)
    .map(page => {
      const pageCenter = page.width / 2

      const parsedPage = {
        num: page.pageId,
        columns: {
          left: page.texts
            .filter(item => item.left < pageCenter && item.text.trim().length > 0)
            .sort((a, b) => ((b.top - a.top) || (a.left - b.left)))
            .map((item) => ({
              content: item.text,
              bold: item.bold,
              italic: item.italic,
              black: item.black
            })),
          right: page.texts
            .filter(item => item.left > pageCenter && item.text.trim().length > 0)
            .sort((a, b) => ((b.top - a.top) || (a.left - b.left)))
            .map((item) => ({
              content: item.text,
              bold: item.bold,
              italic: item.italic,
              black: item.black
            }))
          }
        }

      return parsedPage
    })

  save(parsedPdf)
})