import axios from 'axios';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Table } from '@web3uikit/core';
import { Reload } from '@web3uikit/icons';

function Tokens({ wallet, chain, tokens, setTokens, walletRef }) {
	const [needWallet, setNeedWallet] = useState(false);

	const getTokenBalances = async () => {
		//!useRef doesn't work with web3uikit Input
		// if (!walletRef.current.value) {
		// 	setNeedWallet(true);
		// 	setTokens([]);

		// 	walletRef.current.focus();

		// 	setTimeout(() => {
		// 		setNeedWallet(false);
		// 	}, 3500);
		// } else {

		// }
		setNeedWallet(false);

		try {
			const { data } = await axios.get(
				'http://localhost:3000/api/tokenBalances',
				{
					params: {
						address: wallet,
						chain,
					},
				}
			);

			if (!data.length > 0) {
				return;
			} else {
				for (const token of data) {
					//convert string results to numbers for calculations
					token.bal = (
						Number(token.balance) / Number(`1e${token.decimals}`)
					).toFixed(3); //1E18
					token.val = (
						(Number(token.balance) / Number(`1e${token.decimals}`)) *
						Number(token.usd)
					).toFixed(2);
				}
				setTokens(data);
			}
		} catch (error) {
			console.log(error.message);
		}
	};
	return (
		<>
			{/* <button onClick={getTokenBalances}>Get Tokens</button>
			{needWallet && <span> You must enter a wallet address</span>}
			{tokens.length > 0 &&
				tokens.map(token => (
					<div key={uuidv4()}>
						<span>
							<br />
							<strong>symbol: </strong>
							{token.symbol} <strong>balance: </strong>
							{token.bal}, <strong>value: </strong>
							{token.val}
						</span>
					</div>
				))} */}
			<div className='tabHeading'>
				ERC20 Tokens <Reload onClick={getTokenBalances} />
			</div>

			{tokens.length > 0 && (
				<Table
					pageSize={6}
					noPagination={true}
					style={{ width: '700px' }}
					columnsConfig='300px 300px 250px'
					header={[
						<span key={1}>Currency</span>,
						<span key={2}>Balance</span>,
						<span key={2}>Value</span>,
					]}
					data={tokens.map(token => [token.symbol, token.bal, `$${token.val}`])}
				/>
			)}
		</>
	);
}

export default Tokens;
