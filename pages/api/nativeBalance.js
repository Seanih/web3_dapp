import Moralis from 'moralis';

export default async function handler(req, res) {
	await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

	const { address, chain } = req.query;

	try {
		const response = await Moralis.EvmApi.balance.getNativeBalance({
			address,
			chain,
		});

		const nativeBalance = response.data;

		let nativeCurrency;

		if (chain === '0x1') {
			nativeCurrency = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
		} else if (chain === '0x89') {
			nativeCurrency = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270';
		}

		const nativePrice = await Moralis.EvmApi.token.getTokenPrice({
			address: nativeCurrency,
			chain,
		});

		// add a usd key to nativeBalance to capture nativePrice
		nativeBalance.usd = nativePrice.data.usdPrice;

		res.status(200).send(nativeBalance);
	} catch (error) {
		res.status(400).send(error);
	}
}
