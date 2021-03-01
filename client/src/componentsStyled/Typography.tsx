import React from "react"
import { TextProps, LinkProps } from "./types"
import styled, { css } from "styled-components"

const marginBottom = css`
  margin-bottom: 3rem;
`

export const BottomSpace = styled.div`
  ${marginBottom};
`

export const Title = styled.h1`
  margin: 0 0 2rem;
  font-weight: 300;
`

export const Subtitle = styled.h2`
  margin: 0 0 3rem;
  font-size: 2rem;
`

export const Text = styled.span`
  margin: 0;
  font-size: 1.6rem;
  line-height: 2.5rem;
  ${(props: TextProps) =>
    props.color &&
    css`
      color: ${props.color}
    `};
`

export const Paragraph = styled(Text)`
  ${marginBottom};
`

export const Link = ({ children, className, href, target, rel }: LinkProps) => (
  <a className={className} href={href} target={target} rel={rel}>
    {children}
  </a>
);

export const StyledLink = styled(Link)`
  color: #61dafb;
`