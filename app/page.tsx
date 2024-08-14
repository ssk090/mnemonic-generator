"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ClipboardCopy, Wallet } from "lucide-react";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { useToast } from "@/components/ui/use-toast";

const mnemonic = generateMnemonic();
const seed = mnemonicToSeedSync(mnemonic);

const generatePublicKey = () => {
  return seed.toString("hex").slice(0, 40);
};

interface IWallet {
  name: string;
  publicKey: string;
}

const WebWallet = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [wallets, setWallets] = useState<IWallet[]>([]);
  const [walletName, setWalletName] = useState("");
  const { toast } = useToast();

  const copyMnemonic = async () => {
    await navigator.clipboard.writeText(mnemonic);
    toast({
      title: "Mnemonics copied to clipboard",
    });
  };

  const handleGenerateMnemonic = () => {
    const newMnemonic = generateMnemonic(128); // Generates a 12-word mnemonic
    setMnemonic(newMnemonic);
  };

  const handleAddWallet = () => {
    if (walletName && mnemonic) {
      setWallets([
        ...wallets,
        { name: walletName, publicKey: generatePublicKey() },
      ]);
      setWalletName("");
    }
  };

  return (
    <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <div className="p-4 max-w-md mx-auto space-y-4 ">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2" />
              Web Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Button onClick={handleGenerateMnemonic}>
                  Generate Mnemonic
                </Button>
                {mnemonic && (
                  <Alert className="mt-2  flex items-center">
                    <AlertDescription>{mnemonic}</AlertDescription>
                    <div>
                      <ClipboardCopy
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onClick={copyMnemonic}
                      />
                    </div>
                  </Alert>
                )}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Wallet Name"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                />
                <Button onClick={handleAddWallet} disabled={!walletName}>
                  Add Wallet
                </Button>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Wallets</h3>
                {wallets.map((wallet, index) => (
                  <Card key={index} className="mb-2">
                    <CardContent className="py-2">
                      <p>
                        <strong>{wallet.name}</strong>
                      </p>
                      <p className="text-sm text-gray-500">
                        {wallet.publicKey}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebWallet;
