import {DefaultTheme,createGlobalStyle} from "styled-components";
import { normalize } from "styled-normalize";

declare module 'styled-components'{
  export interface DefaultTheme {
    bgColor: string;
    fontColor: string;
    borderColor: string;
    boxColor: string;
    authBtnColor: string;
  }
}
export const lightTheme: DefaultTheme = {
  bgColor: "#FAFAFA",
  fontColor: "black",
  borderColor: "#CCCCCC",
  boxColor: "white",
  authBtnColor: "#1289F1",
};

export const GlobalStyles = createGlobalStyle`
   ${normalize}
   input {
    all:unset;
  }
  * {
    box-sizing:border-box;
  }
   body{
    background-color:${(props) => props.theme.bgColor};
    font-size:14px;
    font-family:'Open Sans', sans-serif;
    color:${(props) => props.theme.fontColor};
    }
    a {
      text-decoration: none;
    }
`;