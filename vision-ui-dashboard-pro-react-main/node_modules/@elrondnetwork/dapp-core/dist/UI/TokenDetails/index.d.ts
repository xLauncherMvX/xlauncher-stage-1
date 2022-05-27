import React from 'react';
declare type TokenIconProps = {
    token: string;
    combined?: boolean | undefined;
    small?: boolean | undefined;
    tokenAvatar?: string;
};
export default class TokenDetails extends React.Component {
    static Token: (props: TokenIconProps) => JSX.Element;
    static Symbol: (props: TokenIconProps) => JSX.Element;
    static Label: (props: TokenIconProps) => JSX.Element;
    static Icon: (props: TokenIconProps) => JSX.Element;
    render(): null;
}
export {};
