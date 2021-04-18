
export const getColorOfValue = (value: number) => {
  return value < 0 ? 'red' : 'green'
}

export const numberChangeRenderer = (testVal: string) => {
  const text = parseFloat(testVal).toFixed(2)
  return {
    props: {
      style: { color: getColorOfValue(parseFloat(testVal)) }
    },
    children: <span>{text}</span>
  }
}