export function scrollInto(dom) {
  dom.scrollIntoView({ behavior: 'smooth' })
}

export function hasParent(dom, parentDom) {
  parentDom = Array.isArray(parentDom) ? parentDom : [parentDom]

  return parentDom.some(parent => parent.contains(dom))
}
