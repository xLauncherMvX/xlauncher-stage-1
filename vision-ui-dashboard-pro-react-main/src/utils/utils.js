import React,{useState} from "react";

export function calc0(theform) {
    var withNoDecimals = theform.toString().match(/^-?\d+(?:\\d{0})?/)[0];
    return parseFloat(withNoDecimals);
}

export function calc1(theform) {
    var with1Decimal = theform.toString().match(/^-?\d+(?:\.\d{0,1})?/)[0];
    return parseFloat(with1Decimal);
}

export function calc2(theform) {
    var with2Decimals = theform.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    return parseFloat(with2Decimals);
}

export function calc3(theform) {
    var with3Decimals = theform.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
    return parseFloat(with3Decimals);
}

export var egldMultiplier = 1000000000000000000;