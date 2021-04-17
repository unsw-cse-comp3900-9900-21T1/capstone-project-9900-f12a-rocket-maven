import { Tooltip } from 'antd'

export const UnrealisedValue = (
  <Tooltip placement="topLeft" title={`Current Market Value - Purchase Price`} arrowPointAtCenter>
    <span style={{ textDecoration: 'underline dotted' }}>Unrealised</span>
  </Tooltip>
)

export const RealisedValue = (
  <Tooltip placement="topLeft" title={`Sold Value`} arrowPointAtCenter>
    <span style={{ textDecoration: 'underline dotted' }}>Realised</span>
  </Tooltip>
)
