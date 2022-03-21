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
        window.open('https://github.com/musxos/chainlist/blob/main/utils/extraRpcs.json', '_blank');
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
                                    href="https://www.youtube.com/c/AcademyDAO"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg version="1.1" width="32" height="32" viewBox="0 0 24 24">
                                        <path xmlns="http://www.w3.org/2000/svg" style="fill:#F61C0D;" d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728   c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137   C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607   c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"/>
                                    </svg>
                                    <Typography variant="body1" className={classes.sourceCode}>
                                        Follow on YouTube
                                    </Typography>
                                </a>

                                <a
                                    className={`${classes.socialButton}`}
                                    href="https://twitter.com/Ruesandora0"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg width="32" height="32" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
                                        <path xmlns="http://www.w3.org/2000/svg" d="m582.194 205.976c-17.078 7.567-35.424 12.68-54.71 14.991 19.675-11.78 34.769-30.474 41.886-52.726-18.407 10.922-38.798 18.857-60.497 23.111-17.385-18.488-42.132-30.064-69.538-30.064-52.603 0-95.266 42.663-95.266 95.307a97.3 97.3 0 0 0 2.454 21.68c-79.211-3.989-149.383-41.928-196.382-99.562-8.18 14.112-12.885 30.474-12.885 47.899 0 33.05 16.833 62.236 42.377 79.314a95.051 95.051 0 0 1 -43.154-11.924v1.227c0 46.16 32.826 84.672 76.43 93.426a95.97 95.97 0 0 1 -25.095 3.313 95.929 95.929 0 0 1 -17.936-1.677c12.128 37.836 47.306 65.406 89.008 66.142-32.622 25.565-73.71 40.802-118.337 40.802-7.69 0-15.278-.45-22.743-1.33 42.173 27.06 92.24 42.807 146.029 42.807 175.275 0 271.094-145.17 271.094-271.073 0-4.09-.103-8.222-.287-12.312 18.612-13.458 34.769-30.208 47.51-49.29z" fill="#1da1f2"/>
                                    </svg>
                                    <Typography variant="body1" className={classes.sourceCode}>
                                        Follow on Twitter
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
