window.addEventListener(
  'error',
  function(e) {
    const target = e.target // 当前dom节点
    if (target) {
      const { tagName } = target
      if (tagName && tagName.toUpperCase() === 'IMG') {
        target.src =
          'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
      }
    }
  },
  true
)
