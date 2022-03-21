import React, { useMemo } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { withTheme } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import Chain from '../components/chain';
import Header from '../components/header';

import AddIcon from '@material-ui/icons/Add';
import classes from './index.module.css';
import { chainIds } from '../components/chains';
import { fetcher } from '../utils/utils';
import { useSearch, useTestnets } from '../stores';
import allExtraRpcs from '../utils/extraRpcs.json';

function removeEndingSlash(rpc) {
    return rpc.endsWith('/') ? rpc.substr(0, rpc.length - 1) : rpc;
}

export async function getStaticProps({ params }) {
    const chains = await fetcher('https://chainid.network/chains.json');
    const chainTvls = await fetcher('https://api.llama.fi/chains');

    function populateChain(chain) {
        const extraRpcs = allExtraRpcs[chain.name]?.rpcs;
        if (extraRpcs !== undefined) {
            const rpcs = new Set(chain.rpc.map(removeEndingSlash).filter((rpc) => !rpc.includes('${INFURA_API_KEY}')));
            extraRpcs.forEach((rpc) => rpcs.add(removeEndingSlash(rpc)));
            chain.rpc = Array.from(rpcs);
        }
        const chainSlug = chainIds[chain.chainId];
        if (chainSlug !== undefined) {
            const defiChain = chainTvls.find((c) => c.name.toLowerCase() === chainSlug);
            return defiChain === undefined
                ? chain
                : {
                    ...chain,
                    tvl: defiChain.tvl,
                    chainSlug,
                };
        }
        return chain;
    }

    const sortedChains = chains
        .filter((c) => c.name !== '420coin') // same chainId as ronin
        .map(populateChain)
        .sort((a, b) => {
            return (b.tvl ?? 0) - (a.tvl ?? 0);
        });

    return {
        props: {
            sortedChains,
        },
        revalidate: 3600,
    };
}

function Home({ changeTheme, theme, sortedChains }) {
    const testnets = useTestnets((state) => state.testnets);
    const search = useSearch((state) => state.search);

    const addNetwork = () => {
        window.open('https://github.com/ethereum-lists/chains', '_blank');
    };

    const addRpc = () => {
        window.open('https://github.com/DefiLlama/chainlist/blob/main/utils/extraRpcs.json', '_blank');
    };

    const chains = useMemo(() => {
        if (!testnets) {
            return sortedChains.filter((item) => {
                const testnet =
                    item.name?.toLowerCase().includes('test') ||
                    item.title?.toLowerCase().includes('test') ||
                    item.network?.toLowerCase().includes('test');
                return !testnet;
            });
        } else return sortedChains;
    }, [testnets, sortedChains]);

    return (
        <div className={styles.container}>
            <Head>
                <title>AllChain</title>
                <link rel="icon" href="/favicon2.ico" />
            </Head>

            <main className={styles.main}>
                <div className={theme.palette.type === 'dark' ? classes.containerDark : classes.container}>
                    <div className={classes.copyContainer}>
                        <div className={classes.copyCentered}>
                            <Typography variant="h1" className={classes.chainListSpacing}>
                                <span className={classes.helpingUnderline}>AllChain</span>
                            </Typography>
                            <Typography variant="h2" className={classes.helpingParagraph}>
                                Helping users connect to EVM powered networks
                            </Typography>
                            <Typography className={classes.subTitle}>
                                Chainlist is a list of EVM networks. Users can use the information to connect their wallets and Web3
                                middleware providers to the appropriate Chain ID and Network ID to connect to the correct chain.
                            </Typography>
                            <Button
                                size="large"
                                color="primary"
                                variant="contained"
                                className={classes.addNetworkButton}
                                onClick={addNetwork}
                                endIcon={<AddIcon />}
                            >
                                <Typography className={classes.buttonLabel}>Add Your Network</Typography>
                            </Button>
                            <Button
                                size="large"
                                color="primary"
                                variant="outlined"
                                className={classes.addRpcButton}
                                onClick={addRpc}
                                endIcon={<AddIcon />}
                            >
                                <Typography className={classes.buttonLabel}>Add Your RPC</Typography>
                            </Button>
                            <div className={classes.socials}>
                                <a
                                    className={`${classes.socialButton}`}
                                    href="https://t.me/RuesandoraChat"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg version="1.1" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="
                      M 630, 425
                      A 195, 195 0 0 1 331, 600
                      A 142, 142 0 0 0 428, 570
                      A  70,  70 0 0 1 370, 523
                      A  70,  70 0 0 0 401, 521
                      A  70,  70 0 0 1 344, 455
                      A  70,  70 0 0 0 372, 460
                      A  70,  70 0 0 1 354, 370
                      A 195, 195 0 0 0 495, 442
                      A  67,  67 0 0 1 611, 380
                      A 117, 117 0 0 0 654, 363
                      A  65,  65 0 0 1 623, 401
                      A 117, 117 0 0 0 662, 390
                      A  65,  65 0 0 1 630, 425
                      Z"
                                              style="fill:#3BA9EE;"/>
                                    </svg>
                                    <Typography variant="body1" className={classes.sourceCode}>
                                        Follow on Twitter
                                    </Typography>
                                </a>

                                <a
                                    className={`${classes.socialButton}`}
                                    href="https://discord.com/invite/buPFYXzDDd"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg width="24" height="24" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
                                        <path
    fill={'#2F80ED'}
    d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"
    />
                                    </svg>
                                    <Typography variant="body1" className={classes.sourceCode}>
                                        Follow on Youtube
                                    </Typography>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className={theme.palette.type === 'dark' ? classes.listContainerDark : classes.listContainer}>
                        <Header changeTheme={changeTheme} />
                        <div className={classes.cardsContainer}>
                            {(search === ''
                                    ? chains
                                    : chains.filter((chain) => {
                                        //filter
                                        return (
                                            chain.chain.toLowerCase().includes(search.toLowerCase()) ||
                                            chain.chainId.toString().toLowerCase().includes(search.toLowerCase()) ||
                                            chain.name.toLowerCase().includes(search.toLowerCase()) ||
                                            (chain.nativeCurrency ? chain.nativeCurrency.symbol : '')
                                                .toLowerCase()
                                                .includes(search.toLowerCase())
                                        );
                                    })
                            ).map((chain, idx) => {
                                return <Chain chain={chain} key={idx} />;
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default withTheme(Home);
