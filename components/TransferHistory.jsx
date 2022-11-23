import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Table } from '@web3uikit/core';
import { Reload } from '@web3uikit/icons';

function TransferHistory({ chain, wallet, transfers, setTransfers }) {
	const getTokenTransfers = async () => {
		const { data } = await axios.get(
			'http://localhost:3000/api/tokenTransfers',
			{
				params: {
					address: wallet,
					chain,
				},
			}
		);

		if (data) {
			setTransfers(data);
		}
	};
	return (
		<>
			<div className='tabHeading'>
				Transfer History <Reload onClick={getTokenTransfers} />
			</div>
			<>
				{transfers.length > 0 && (
					<Table
						pageSize={6}
						noPagination={false}
						style={{ width: '90vw' }}
						columnsConfig='16vw 18vw 18vw 18vw 16vw'
						header={[
							<span key={1}>Token</span>,
							<span key={2}>Amount</span>,
							<span key={3}>From</span>,
							<span key={4}>To</span>,
							<span key={5}>Date</span>,
						]}
						//data takes an array of arrays for table rows
						data={transfers.map(transfer => [
							transfer.symbol,
							(
								Number(transfer.value) / Number(`1e${transfer.decimals}`)
							).toFixed(3),
							`${transfer.from_address.slice(
								0,
								4
							)}...${transfer.from_address.slice(38)}`,
							`${transfer.to_address.slice(0, 4)}...${transfer.to_address.slice(
								38
							)}`,
							transfer.block_timestamp.slice(0, 10),
						])}
					/>
				)}
			</>
			{/* <h1>Transfer History</h1>
			<>
				<button onClick={getTokenTransfers}>Fetch Transfers</button>

				<table>
					<thead>
						<tr>
							<th>Token</th>
							<th>Amount</th>
							<th>From</th>
							<th>To</th>
							<th>Date</th>
						</tr>
					</thead>
					{transfers.length > 0 &&
						transfers.map(transfer => (
							<tbody key={uuidv4()}>
								<tr>
									<td>{transfer.symbol}</td>
									<td>
										{(
											Number(transfer.value) / Number(`1e${transfer.decimals}`)
										).toFixed(3)}
									</td>
									<td>{transfer.from_address}</td>
									<td>{transfer.to_address}</td>
									<td>{transfer.block_timestamp}</td>
								</tr>
							</tbody>
						))}
				</table>
			</> */}
		</>
	);
}
export default TransferHistory;
