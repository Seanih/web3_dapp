import Moralis from 'moralis';

export default async function handler(req, res) {
	await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

	const { address, chain } = req.query;

	try {
		const { data } = await Moralis.EvmApi.nft.getWalletNFTs({
			address,
			chain,
		});

		res.status(200).send(data);
	} catch (error) {
		res.status(400).send(error.message);
	}
}
