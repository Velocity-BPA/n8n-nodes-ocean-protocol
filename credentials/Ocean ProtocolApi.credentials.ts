import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class OceanProtocolApi implements ICredentialType {
	name = 'oceanProtocolApi';
	displayName = 'Ocean Protocol API';
	documentationUrl = 'https://docs.oceanprotocol.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Ocean Protocol API key for authenticated requests',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://v4.aquarius.oceanprotocol.com',
			description: 'Base URL for Ocean Protocol API',
		},
	];
}