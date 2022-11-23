import axios from 'axios';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';
import { Table, Input } from '@web3uikit/core';
import { Reload } from '@web3uikit/icons';

function Nfts({ wallet, chain, nfts, setNfts, filteredNfts, setFilteredNfts }) {
	const [nameFilter, setNameFilter] = useState('');
	const [idFilter, setIdFilter] = useState('');

	useEffect(() => {
		if (!nameFilter && !idFilter) {
			return setFilteredNfts(nfts);
		}

		// created new var to hold nfts added during the loop
		let fltrdNfts = [];

		for (const nft of nfts) {
			if (
				(nft.name.toLowerCase().includes(nameFilter) && !idFilter) ||
				(nft.token_id.includes(idFilter) && !nameFilter) ||
				(nft.name.toLowerCase().includes(nameFilter) &&
					nft.token_id.includes(idFilter))
			) {
				fltrdNfts.push(nft);
			}
		}

		setFilteredNfts(fltrdNfts);
	}, [nameFilter, idFilter]);

	const getUserNfts = async () => {
		const {
			data: { result },
		} = await axios.get('http://localhost:3000/api/nftBalance', {
			params: { address: wallet, chain },
		});

		if (result) {
			nftProcessing(result);
		}
	};

	function nftProcessing(nftArray) {
		for (const nft of nftArray) {
			let meta = JSON.parse(nft.metadata);

			if (meta && meta.image) {
				if (meta.image.includes('.')) {
					nft.image = meta.image;
				} else {
					nft.image = 'https://ipfs.moralis.io:2053/ipfs/' + meta.image;
				}
			}
			console.log(nft.image);
		}

		setNfts(nftArray);
		setFilteredNfts(nftArray);
	}
	return (
		<>
			<div className='tabHeading'>
				NFT Portfolio <Reload onClick={getUserNfts} />
			</div>
			<div className='filters'>
				<Input
					id='NameF'
					label='Name Filter'
					labelBgColor='rgb(33,33,38)'
					value={nameFilter}
					style={{}}
					onChange={e => setNameFilter(e.target.value)}
				/>
				<Input
					id='IdF'
					label='Id Filter'
					labelBgColor='rgb(33,33,38)'
					value={idFilter}
					style={{}}
					onChange={e => setIdFilter(e.target.value)}
				/>
			</div>
			<div className='nftList'>
				{filteredNfts.length > 0 &&
					filteredNfts.map(nft => (
						<div key={uuidv4()} className='nftInfo'>
							{nft.image && (
								<Image src={nft.image} width={200} height={200} alt='' />
							)}

							<>Name: {nft.name}</>
							<>
								{' '}
								(ID: {/* make long IDs readable */}
								{nft.token_id.length > 5
									? `${nft.token_id.slice(0, 4)}...${nft.token_id.slice(
											nft.token_id.length - 4
									  )}`
									: nft.token_id}
								)
							</>
						</div>
					))}
			</div>
			{/* <h1>Portfolio NFTs</h1>
			<>
				<button onClick={getUserNfts}>Fetch NFTs</button>
				<br />
				<label>
					Name Filter
					<input type='text' onChange={e => setNameFilter(e.target.value)} />
				</label>
				<label>
					ID Filter
					<input type='text' onChange={e => setIdFilter(e.target.value)} />
				</label>

				{filteredNfts.length > 0 &&
					filteredNfts.map(nft => (
						<div key={uuidv4()}>
							{nft.image && (
								<Image src={nft.image} width={200} height={200} alt='nft' />
							)}
							<span>Name: {nft.name}</span>
							<span>(ID: {nft.token_id})</span>
							<br />
						</div>
					))}
			</> */}
		</>
	);
}
export default Nfts;
