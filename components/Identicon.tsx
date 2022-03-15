import React from "react";
import { useEthers } from "@usedapp/core";
import JazzIcon, { jsNumberForAddress } from 'react-jazzicon'

type Props = {
  diameter?: number;
  address?: string;
}

export default function Identicon({ diameter = 16, address }: Props) {

  const { account } = useEthers();

  const finalAdress = address || account || "";

  return <JazzIcon diameter={diameter} seed={jsNumberForAddress(finalAdress)} />;
  
}
