import axios from 'axios';
import { Table } from '@web3uikit/core';
import { Reload } from '@web3uikit/icons';

function NativeTokens({
	wallet,
	chain,
	nativeBalance,
	setNativeBalance,
	nativeValue,
	setNativeValue,
}) {
	const getNativeBalance = async () => {
		const { data } = await axios.get(
			'http://localhost:3000/api/nativeBalance',
			{
				params: {
					address: wallet,
					chain,
				},
			}
		);

		if (data.balance && data.usd) {
			setNativeBalance((Number(data.balance) / 1e18).toFixed(3));
			setNativeValue(
				((Number(data.balance) / 1e18) * Number(data.usd)).toFixed(2)
			);
		}
	};

	return (
		<>
			{/* <h1>Fetch Wallet Info</h1>
			<p>
				<button onClick={getNativeBalance}>Show me the money!!!</button>
				<span>
					Native Balance: {nativeBalance}, (${nativeValue})
				</span>
			</p> */}
			<div className='tabHeading'>
				Native Balance <Reload onClick={getNativeBalance} />
			</div>
			{nativeBalance > 0 && nativeValue > 0 && (
				<Table
					pageSize={1}
					noPagination={true}
					style={{ width: '700px' }}
					columnsConfig='300px 300px 250px'
					header={[
						<span key={1}>Currency</span>,
						<span key={2}>Balance</span>,
						<span key={2}>Value</span>,
					]}
					//data takes an array of arrays for table rows
					data={[['Native', nativeBalance, `$${nativeValue}`]]}
				/>
			)}
		</>
	);
}
export default NativeTokens;
