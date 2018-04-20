
export default function (type) {
  let page = findPage()
  if (page) {
    page.style.webkitOverflowScrolling = type
  }
}

const findPage = function () {
  let page
  if (window.__$uiPageConfig.scrollType === 'body') {
    page = document.body
  } else {
    page = document.querySelector(`.${window.__$uiPageConfig.pageClass}`)
    if (page) {
      let classList = Array.from(page.classList)
      if (classList.indexOf('ui-page') < 0) {
        page = page.querySelector('.ui-page')
      }
    }
  }
  return page
}