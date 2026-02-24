import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class OceanProtocolApi implements ICredentialType {
	name = 'oceanProtocolApi';
	displayName = 'Ocean Protocol API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://v4.aquarius.oceanprotocol.com',
			placeholder: 'https://v4.aquarius.oceanprotocol.com',
			description: 'The base URL for the Ocean Protocol Aquarius API',
			required: true,
		},
		{
			displayName: 'Wallet Address',
			name: 'walletAddress',
			type: 'string',
			default: '',
			placeholder: '0x...',
			description: 'Your Ethereum wallet address for Ocean Protocol interactions',
			required: false,
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Private key for signing transactions (required for write operations)',
			required: false,
		},
		{
			displayName: 'Network Chain ID',
			name: 'chainId',
			type: 'options',
			options: [
				{
					name: 'Ethereum Mainnet',
					value: 1,
				},
				{
					name: 'Polygon',
					value: 137,
				},
				{
					name: 'BSC',
					value: 56,
				},
				{
					name: 'Moonriver',
					value: 1285,
				},
			],
			default: 1,
			description: 'The blockchain network to interact with',
			required: true,
		},
	];
}