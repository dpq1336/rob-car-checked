export function getInnerColor(res) {
  res.map((value, index, array) => {
    if (value.innerColorRgb) {
      if (value.innerColorRgb.length > 10) {
        value.innerFirst = value.innerColorRgb.split(',')[0]
        value.innerLast = value.innerColorRgb.split(',')[1]
      } else if (0 < value.innerColorRgb.length <= 10) {
        value.innerFirst = value.innerColorRgb.split(',')[0]
      }
    }

  })
  return res
}
