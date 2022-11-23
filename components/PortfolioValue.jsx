import { useState, useEffect } from 'react';

function PortfolioValue({ nativeValue, tokens }) {
	const [totalValue, setTotalValue] = useState();

	useEffect(() => {
		let val = 0;

		for (const token of tokens) {
			val += Number(token.val);
		}

		// adds value of any native coins to the total token value
		val += Number(nativeValue);
		setTotalValue(val.toFixed(2));
	}, [nativeValue, tokens]);

	return (
		<>
			<div className='totalValue'>
				<h3>Portfolio Total Value</h3>
				<h2>${totalValue}</h2>
			</div>
		</>
	);
}
export default PortfolioValue;
