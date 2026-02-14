import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set via environment variable or defaults to 'devnet'
    // Options: 'devnet', 'testnet', or 'mainnet-beta'
    const networkFromEnv = import.meta.env.VITE_SOLANA_NETWORK as WalletAdapterNetwork | undefined;
    const network = networkFromEnv || WalletAdapterNetwork.Devnet;

    // You can provide a custom RPC endpoint via environment variable
    // This is recommended for production to use a dedicated RPC provider
    const customEndpoint = import.meta.env.VITE_SOLANA_RPC_URL;
    const endpoint = useMemo(() => {
        if (customEndpoint) {
            console.log('Using custom RPC endpoint');
            return customEndpoint;
        }
        return clusterApiUrl(network);
    }, [network, customEndpoint]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

