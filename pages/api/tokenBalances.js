import Moralis from 'moralis';

export default async function handler(req, res) {
	await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

	const { address, chain } = req.query;

	try {
		const response = await Moralis.EvmApi.token.getWalletTokenBalances({
			address,
			chain,
		});

		let tokens = response.data;

		let legitTokens = [];

		for (const token of tokens) {
			const priceResponse = await Moralis.EvmApi.token.getTokenPrice({
				address: token.token_address,
				chain,
			});

			if (priceResponse.data.usdPrice > 0.01) {
				token.usd = priceResponse.data.usdPrice;
				legitTokens.push(token);
			} else {
				console.log('shit coin');
			}
		}

		if (legitTokens.length > 0) {
			console.log(
				`total tokens: ${tokens.length}`,
				`legit tokens: ${legitTokens.length}`
			);

			res.status(200).send(legitTokens);
		} else {
			res
				.status(200)
				.send({ message: 'sorry, nothing but blanks or shit coins' });
		}
	} catch (error) {
		res.status(400).send(error.message);
	}
}
