import { css } from '@emotion/react'

export const column = css`
  display: flex;
  flex-direction: column;
`

export const row = css`
  display: flex;
  flex-direction: row;
`
export const aroundCenter = css`
  justify-content: space-around;
  align-items: center;
`

export const aroundEnd = css`
  justify-content: space-around;
  align-items: flex-end;
`

export const betweenCenter = css`
  justify-content: space-between;
  align-items: center;
`

export const betweenEnd = css`
  justify-content: space-between;
  align-items: flex-end;
`

export const betweenStart = css`
  justify-content: space-between;
  align-items: flex-start;
`

export const centerCenter = css`
  justify-content: center;
  align-items: center;
`

export const centerEnd = css`
  justify-content: center;
  align-items: flex-end;
`

export const centerStart = css`
  justify-content: center;
  align-items: flex-start;
`

export const endStart = css`
  justify-content: flex-end;
  align-items: flex-start;
`

export const startCenter = css`
  justify-content: flex-start;
  align-items: center;
`

export const startStart = css`
  justify-content: flex-start;
  align-items: flex-start;
`

export const startEnd = css`
  justify-content: flex-start;
  align-items: flex-end;
`
