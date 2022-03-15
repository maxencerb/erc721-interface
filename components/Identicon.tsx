import React, { useEffect, useRef } from "react";
import { useEthers } from "@usedapp/core";
import styled from "@emotion/styled";
import Jazzicon from "@metamask/jazzicon";

type Props = {
  diameter?: number;
  address?: string;
}

export default function Identicon({ diameter = 16, address }: Props) {
  const ref = useRef<HTMLDivElement>();
  const { account } = useEthers();

  const finalAdress = address || account;

  console.log(finalAdress);

  useEffect(() => {
    if (finalAdress && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(diameter, parseInt(finalAdress.slice(2, 10), 16)));
    }
  }, [finalAdress, diameter]);

  return <div 
    ref={ref as any} 
    style={{
      height: diameter,
      width: diameter,
      borderRadius: "50%",
      backgroundColor: "black",
    }}
  />
}
