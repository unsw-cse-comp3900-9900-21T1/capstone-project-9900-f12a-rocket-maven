import styled from 'styled-components'

export const AppWrap = styled.div`
  display: flex;

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #fafbfc;
`

export const ContentWrap = styled.div`
  flex-grow: 1;
  min-height: 100vh;
  overflow: auto;
`
