/* Creative Commons Attribution 4.0 International (CC-BY-4.0) */
/* Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com) */
/* This source code was getting from https://github.com/tastejs/todomvc-app-css/blob/03e753aa21bd555cbdc2aa09185ecb9905d1bf16/index.css */

import styled from '@emotion/styled'
import { base } from '../style'

export const Container = styled.div`
  .new-todo {
    ${base.textInput};
    padding: 16px 16px 16px 60px;
    border: none;
    background: rgba(0, 0, 0, 0.003);
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
  }  
  
  p {
    color: red;
  }
  
  .title {
    text-align: center;
  }
`

export const Buttons = styled.div`
display: flex;
button, a {
  background: #ccc;
  padding: 10px 15px;
  text-align: center;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 20px;
  text-decoration: none;
  color: #222;
  
  &:first-child {
    margin-right: 10px;
    background: #abc;
    cursor: pointer;
    color: #fff;
  }
}
  
`
