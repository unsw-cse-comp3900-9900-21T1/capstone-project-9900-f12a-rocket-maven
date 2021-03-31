import styled, { css } from 'styled-components'
import { StyledLink } from '@rocketmaven/componentsStyled/Typography'
import { Menu } from 'antd'
// import { FromProp } from "helpers/FromProp"
// import { linker } from "hoc/linker"

export const SidebarWrap = styled(Menu)`
  min-height: 100vh;
  min-width: 180px;
  max-width: 180px;
`

/*`
  overflow: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-shrink: 0;
  min-height: 100vh;
  overflow: auto;
  width: 15rem;
  overflow: auto,
  height: 100vh,
  position: fixed,
  left: 0,
  border-right: 0 !important,
  }}
`
*/

// const hoverStyle = css`
//   font-weight: 400;
//   background: rgba(0, 0, 0, 0.2);
// `
