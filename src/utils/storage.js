import { setStorageSync, getStorageSync } from './wxTool'

// wzj_visitor
export function getWzjVisitor() {
  return getStorageSync('wzj_visitor')
}

export function setWzjVisitor(opt) {
  setStorageSync('wzj_visitor', opt)
}
