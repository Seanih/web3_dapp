import Moralis from 'moralis';
import { use } from 'react';

export default async function handler(req, res) {
	await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

	const { address, chain } = req.query;

	try {
		const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
			address,
			chain,
		});

		const userTxs = response.data.result;

		for (const tx of userTxs) {
			const { data } = await Moralis.EvmApi.token.getTokenMetadata({
				addresses: [tx.address],
				chain,
			});

			if (data) {
				tx.decimals = data[0].decimals;
				tx.symbol = data[0].symbol;
			} else {
				console.log('no details for this token');
			}
		}

		res.status(200).send(userTxs);
	} catch (error) {
		res.status(400).send(error.message);
	}
}
