/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-oceanprotocol/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class OceanProtocol implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Ocean Protocol',
    name: 'oceanprotocol',
    icon: 'file:oceanprotocol.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Ocean Protocol API',
    defaults: {
      name: 'Ocean Protocol',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'oceanprotocolApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Asset',
            value: 'asset',
          },
          {
            name: 'Datatoken',
            value: 'datatoken',
          },
          {
            name: 'ComputeJob',
            value: 'computeJob',
          },
          {
            name: 'VeOcean',
            value: 'veOcean',
          },
          {
            name: 'Order',
            value: 'order',
          },
          {
            name: 'Provider',
            value: 'provider',
          }
        ],
        default: 'asset',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['asset'] } },
  options: [
    { name: 'Create Asset', value: 'createAsset', description: 'Create a new data asset with metadata', action: 'Create asset' },
    { name: 'Get Asset', value: 'getAsset', description: 'Retrieve asset details by DID', action: 'Get asset' },
    { name: 'Get All Assets', value: 'getAllAssets', description: 'List all available assets with pagination', action: 'Get all assets' },
    { name: 'Update Asset', value: 'updateAsset', description: 'Update asset metadata and services', action: 'Update asset' },
    { name: 'Delete Asset', value: 'deleteAsset', description: 'Remove asset from registry', action: 'Delete asset' },
    { name: 'Query Assets', value: 'queryAssets', description: 'Search assets using Elasticsearch query', action: 'Query assets' }
  ],
  default: 'createAsset',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['datatoken'],
		},
	},
	options: [
		{
			name: 'Create Datatoken',
			value: 'createDatatoken',
			description: 'Create a new datatoken for an asset',
			action: 'Create a datatoken',
		},
		{
			name: 'Get Datatoken',
			value: 'getDatatoken',
			description: 'Get datatoken details by contract address',
			action: 'Get a datatoken',
		},
		{
			name: 'Get All Datatokens',
			value: 'getAllDatatokens',
			description: 'List all datatokens with filtering',
			action: 'Get all datatokens',
		},
		{
			name: 'Update Datatoken',
			value: 'updateDatatoken',
			description: 'Update datatoken properties',
			action: 'Update a datatoken',
		},
		{
			name: 'Mint Datatoken',
			value: 'mintDatatoken',
			description: 'Mint datatoken to specified address',
			action: 'Mint a datatoken',
		},
	],
	default: 'createDatatoken',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['computeJob'],
		},
	},
	options: [
		{
			name: 'Create Compute Job',
			value: 'createComputeJob',
			description: 'Start a new compute job for privacy-preserving data processing',
			action: 'Create compute job',
		},
		{
			name: 'Get Compute Job',
			value: 'getComputeJob',
			description: 'Get compute job status and details',
			action: 'Get compute job',
		},
		{
			name: 'Get All Compute Jobs',
			value: 'getAllComputeJobs',
			description: 'List all compute jobs for consumer',
			action: 'Get all compute jobs',
		},
		{
			name: 'Update Compute Job',
			value: 'updateComputeJob',
			description: 'Stop or restart a compute job',
			action: 'Update compute job',
		},
		{
			name: 'Delete Compute Job',
			value: 'deleteComputeJob',
			description: 'Delete compute job and results',
			action: 'Delete compute job',
		},
	],
	default: 'createComputeJob',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['veOcean'] } },
  options: [
    {
      name: 'Get veOCEAN Locks',
      value: 'getVeOceanLocks',
      description: 'Get user\'s veOCEAN lock details',
      action: 'Get veOCEAN locks'
    },
    {
      name: 'Create veOCEAN Lock',
      value: 'createVeOceanLock',
      description: 'Lock OCEAN tokens to get veOCEAN',
      action: 'Create veOCEAN lock'
    },
    {
      name: 'Get veOCEAN Rewards',
      value: 'getVeOceanRewards',
      description: 'Get user\'s veOCEAN rewards',
      action: 'Get veOCEAN rewards'
    },
    {
      name: 'Claim veOCEAN Rewards',
      value: 'claimVeOceanRewards',
      description: 'Claim available veOCEAN rewards',
      action: 'Claim veOCEAN rewards'
    },
    {
      name: 'Get All veOCEAN Allocations',
      value: 'getAllVeOceanAllocations',
      description: 'Get all veOCEAN allocations for current epoch',
      action: 'Get all veOCEAN allocations'
    }
  ],
  default: 'getVeOceanLocks'
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['order'],
		},
	},
	options: [
		{
			name: 'Create Order',
			value: 'createOrder',
			description: 'Place order to access an asset',
			action: 'Create an order',
		},
		{
			name: 'Get Order',
			value: 'getOrder',
			description: 'Get order details by transaction ID',
			action: 'Get an order',
		},
		{
			name: 'Get All Orders',
			value: 'getAllOrders',
			description: 'List all orders for a consumer',
			action: 'Get all orders',
		},
		{
			name: 'Download Asset',
			value: 'downloadAsset',
			description: 'Download asset after successful order',
			action: 'Download an asset',
		},
		{
			name: 'Initialize Asset',
			value: 'initializeAsset',
			description: 'Initialize asset service for access',
			action: 'Initialize an asset',
		},
	],
	default: 'createOrder',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['provider'],
		},
	},
	options: [
		{
			name: 'Get Provider',
			value: 'getProvider',
			description: 'Get provider service information',
			action: 'Get provider service information',
		},
		{
			name: 'Encrypt Data',
			value: 'encryptData',
			description: 'Encrypt data for secure storage',
			action: 'Encrypt data for secure storage',
		},
		{
			name: 'Get File Info',
			value: 'getFileInfo',
			description: 'Get file information without downloading',
			action: 'Get file information without downloading',
		},
		{
			name: 'Get Nonce',
			value: 'getNonce',
			description: 'Get nonce for transaction signing',
			action: 'Get nonce for transaction signing',
		},
		{
			name: 'Validate Asset',
			value: 'validateAsset',
			description: 'Validate asset accessibility and metadata',
			action: 'Validate asset accessibility and metadata',
		},
	],
	default: 'getProvider',
},
{
  displayName: 'DID',
  name: 'did',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['createAsset']
    }
  },
  default: '',
  description: 'Decentralized Identifier for the asset'
},
{
  displayName: 'Metadata',
  name: 'metadata',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['createAsset']
    }
  },
  default: '{}',
  description: 'Asset metadata including name, description, and other properties'
},
{
  displayName: 'Services',
  name: 'services',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['createAsset']
    }
  },
  default: '[]',
  description: 'Array of services associated with the asset'
},
{
  displayName: 'DID',
  name: 'did',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['getAsset']
    }
  },
  default: '',
  description: 'Decentralized Identifier for the asset to retrieve'
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['getAllAssets']
    }
  },
  default: 1,
  description: 'Page number for pagination'
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['getAllAssets']
    }
  },
  default: 0,
  description: 'Number of records to skip'
},
{
  displayName: 'Sort',
  name: 'sort',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['getAllAssets']
    }
  },
  default: 'created',
  description: 'Field to sort by'
},
{
  displayName: 'Ascending',
  name: 'asc',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['getAllAssets']
    }
  },
  default: true,
  description: 'Sort in ascending order'
},
{
  displayName: 'DID',
  name: 'did',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['updateAsset']
    }
  },
  default: '',
  description: 'Decentralized Identifier for the asset to update'
},
{
  displayName: 'Metadata',
  name: 'metadata',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['updateAsset']
    }
  },
  default: '{}',
  description: 'Updated asset metadata'
},
{
  displayName: 'DID',
  name: 'did',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['deleteAsset']
    }
  },
  default: '',
  description: 'Decentralized Identifier for the asset to delete'
},
{
  displayName: 'Query',
  name: 'query',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['queryAssets']
    }
  },
  default: '{}',
  description: 'Elasticsearch query object'
},
{
  displayName: 'Sort',
  name: 'sort',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['queryAssets']
    }
  },
  default: 'created',
  description: 'Field to sort by'
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['queryAssets']
    }
  },
  default: 0,
  description: 'Number of records to skip'
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['asset'],
      operation: ['queryAssets']
    }
  },
  default: 1,
  description: 'Page number for pagination'
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['datatoken'],
			operation: ['createDatatoken'],
		},
	},
	default: '',
	description: 'Name of the datatoken',
},
{
	displayName: 'Symbol',
	name: 'symbol',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['datatoken'],
			operation: ['createDatatoken'],
		},
	},
	default: '',
	description: 'Symbol of the datatoken',
},
{
	displayName: 'Template Index',
	name: 'templateIndex',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['datatoken'],
			operation: ['createDatatoken'],
		},
	},
	default: 1,
	description: 'Template index for the datatoken',
},
{
	displayName: 'Minter',
	name: 'minter',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['datatoken'],
			operation: ['createDatatoken', 'updateDatatoken'],
		},
	},
	default: '',
	description: 'Address of the minter',
},
{
	displayName: 'Cap',
	name: 'cap',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['datatoken'],
			operation: ['createDatatoken', 'updateDatatoken'],
		},
	},
	default: '',
	description: 'Maximum cap for the datatoken',
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['datatoken'],
			operation: ['getDatatoken', 'updateDatatoken', 'mintDatatoken'],
		},
	},
	default: '',
	description: 'Contract address of the datatoken',
},
{
	displayName: 'Chain ID',
	name: 'chainId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['datatoken'],
			operation: ['getAllDatatokens'],
		},
	},
	default: '',
	description: 'Blockchain network chain ID',
},
{
	displayName: 'Owner',
	name: 'owner',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['datatoken'],
			operation: ['getAllDatatokens'],
		},
	},
	default: '',
	description: 'Owner address to filter by',
},
{
	displayName: 'Page',
	name: 'page',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['datatoken'],
			operation: ['getAllDatatokens'],
		},
	},
	default: 1,
	description: 'Page number for pagination',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['datatoken'],
			operation: ['getAllDatatokens'],
		},
	},
	default: 100,
	description: 'Number of items per page',
},
{
	displayName: 'Amount',
	name: 'amount',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['datatoken'],
			operation: ['mintDatatoken'],
		},
	},
	default: '',
	description: 'Amount of datatokens to mint',
},
{
	displayName: 'To',
	name: 'to',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['datatoken'],
			operation: ['mintDatatoken'],
		},
	},
	default: '',
	description: 'Address to mint the datatokens to',
},
{
	displayName: 'Signature',
	name: 'signature',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['computeJob'],
			operation: ['createComputeJob', 'getComputeJob', 'getAllComputeJobs', 'updateComputeJob', 'deleteComputeJob'],
		},
	},
	default: '',
	description: 'Cryptographic signature for authentication',
},
{
	displayName: 'Document ID',
	name: 'documentId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['computeJob'],
			operation: ['createComputeJob', 'getComputeJob', 'updateComputeJob', 'deleteComputeJob'],
		},
	},
	default: '',
	description: 'The ID of the document/dataset for compute job',
},
{
	displayName: 'Service ID',
	name: 'serviceId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['computeJob'],
			operation: ['createComputeJob', 'getComputeJob', 'updateComputeJob', 'deleteComputeJob'],
		},
	},
	default: '',
	description: 'The ID of the compute service',
},
{
	displayName: 'Consumer Address',
	name: 'consumerAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['computeJob'],
			operation: ['createComputeJob', 'getComputeJob', 'getAllComputeJobs', 'updateComputeJob', 'deleteComputeJob'],
		},
	},
	default: '',
	description: 'The wallet address of the consumer',
},
{
	displayName: 'Job ID',
	name: 'jobId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['computeJob'],
			operation: ['createComputeJob', 'getComputeJob', 'updateComputeJob', 'deleteComputeJob'],
		},
	},
	default: '',
	description: 'The unique identifier for the compute job',
},
{
	displayName: 'Output',
	name: 'output',
	type: 'json',
	required: false,
	displayOptions: {
		show: {
			resource: ['computeJob'],
			operation: ['createComputeJob'],
		},
	},
	default: '{}',
	description: 'Output configuration for the compute job',
},
{
	displayName: 'Action',
	name: 'action',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['computeJob'],
			operation: ['updateComputeJob'],
		},
	},
	options: [
		{
			name: 'Stop',
			value: 'stop',
			description: 'Stop the compute job',
		},
		{
			name: 'Restart',
			value: 'restart',
			description: 'Restart the compute job',
		},
	],
	default: 'stop',
	description: 'The action to perform on the compute job',
},
{
  displayName: 'User Address',
  name: 'user',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['getVeOceanLocks']
    }
  },
  default: '',
  description: 'The user wallet address to get veOCEAN locks for'
},
{
  displayName: 'Chain ID',
  name: 'chainId',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['getVeOceanLocks']
    }
  },
  options: [
    { name: 'Ethereum', value: '1' },
    { name: 'Polygon', value: '137' },
    { name: 'BSC', value: '56' }
  ],
  default: '1',
  description: 'The blockchain network chain ID'
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['createVeOceanLock']
    }
  },
  default: '',
  description: 'Amount of OCEAN tokens to lock (in wei or token units)'
},
{
  displayName: 'Unlock Time',
  name: 'unlockTime',
  type: 'dateTime',
  required: true,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['createVeOceanLock']
    }
  },
  default: '',
  description: 'Timestamp when the locked tokens can be unlocked'
},
{
  displayName: 'User Address',
  name: 'user',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['createVeOceanLock']
    }
  },
  default: '',
  description: 'The user wallet address creating the lock'
},
{
  displayName: 'User Address',
  name: 'user',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['getVeOceanRewards']
    }
  },
  default: '',
  description: 'The user wallet address to get rewards for'
},
{
  displayName: 'Chain ID',
  name: 'chainId',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['getVeOceanRewards']
    }
  },
  options: [
    { name: 'Ethereum', value: '1' },
    { name: 'Polygon', value: '137' },
    { name: 'BSC', value: '56' }
  ],
  default: '1',
  description: 'The blockchain network chain ID'
},
{
  displayName: 'User Address',
  name: 'user',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['claimVeOceanRewards']
    }
  },
  default: '',
  description: 'The user wallet address claiming rewards'
},
{
  displayName: 'Amounts',
  name: 'amounts',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['claimVeOceanRewards']
    }
  },
  default: '',
  description: 'Comma-separated list of amounts to claim'
},
{
  displayName: 'Chain ID',
  name: 'chainId',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['claimVeOceanRewards']
    }
  },
  options: [
    { name: 'Ethereum', value: '1' },
    { name: 'Polygon', value: '137' },
    { name: 'BSC', value: '56' }
  ],
  default: '1',
  description: 'The blockchain network chain ID'
},
{
  displayName: 'Chain ID',
  name: 'chainId',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['getAllVeOceanAllocations']
    }
  },
  options: [
    { name: 'Ethereum', value: '1' },
    { name: 'Polygon', value: '137' },
    { name: 'BSC', value: '56' }
  ],
  default: '1',
  description: 'The blockchain network chain ID'
},
{
  displayName: 'Epoch',
  name: 'epoch',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['getAllVeOceanAllocations']
    }
  },
  default: 0,
  description: 'Specific epoch to get allocations for (leave empty for current epoch)'
},
{
	displayName: 'Document ID',
	name: 'documentId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['createOrder'],
		},
	},
	default: '',
	description: 'The document ID of the asset to order',
},
{
	displayName: 'Service ID',
	name: 'serviceId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['createOrder'],
		},
	},
	default: '',
	description: 'The service ID for the asset',
},
{
	displayName: 'Consumer Address',
	name: 'consumerAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['createOrder'],
		},
	},
	default: '',
	description: 'The wallet address of the consumer placing the order',
},
{
	displayName: 'Signature',
	name: 'signature',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['createOrder'],
		},
	},
	default: '',
	description: 'Web3 signature for the order transaction',
},
{
	displayName: 'Transaction ID',
	name: 'txId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['getOrder'],
		},
	},
	default: '',
	description: 'The transaction ID of the order to retrieve',
},
{
	displayName: 'Consumer Address',
	name: 'consumerAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['getAllOrders'],
		},
	},
	default: '',
	description: 'The wallet address of the consumer to get orders for',
},
{
	displayName: 'Page',
	name: 'page',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['getAllOrders'],
		},
	},
	default: 1,
	description: 'Page number for pagination',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['getAllOrders'],
		},
	},
	default: 0,
	description: 'Number of records to skip',
},
{
	displayName: 'Document ID',
	name: 'documentId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['downloadAsset'],
		},
	},
	default: '',
	description: 'The document ID of the asset to download',
},
{
	displayName: 'Service ID',
	name: 'serviceId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['downloadAsset'],
		},
	},
	default: '',
	description: 'The service ID for the asset',
},
{
	displayName: 'File Index',
	name: 'fileIndex',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['downloadAsset'],
		},
	},
	default: 0,
	description: 'Index of the file to download from the asset',
},
{
	displayName: 'Signature',
	name: 'signature',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['downloadAsset'],
		},
	},
	default: '',
	description: 'Web3 signature for the download request',
},
{
	displayName: 'Document ID',
	name: 'documentId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['initializeAsset'],
		},
	},
	default: '',
	description: 'The document ID of the asset to initialize',
},
{
	displayName: 'Service ID',
	name: 'serviceId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['initializeAsset'],
		},
	},
	default: '',
	description: 'The service ID for the asset',
},
{
	displayName: 'Signature',
	name: 'signature',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['initializeAsset'],
		},
	},
	default: '',
	description: 'Web3 signature for the initialization request',
},
{
	displayName: 'Consumer Address',
	name: 'consumerAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['order'],
			operation: ['initializeAsset'],
		},
	},
	default: '',
	description: 'The wallet address of the consumer initializing the asset',
},
{
	displayName: 'Document ID',
	name: 'documentId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['provider'],
			operation: ['encryptData'],
		},
	},
	default: '',
	description: 'The document identifier to encrypt',
},
{
	displayName: 'Signature',
	name: 'signature',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['provider'],
			operation: ['encryptData', 'getFileInfo', 'validateAsset'],
		},
	},
	default: '',
	description: 'Digital signature for authentication',
},
{
	displayName: 'Document',
	name: 'document',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['provider'],
			operation: ['encryptData'],
		},
	},
	default: '{}',
	description: 'The document data to encrypt',
},
{
	displayName: 'DID',
	name: 'did',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['provider'],
			operation: ['getFileInfo', 'validateAsset'],
		},
	},
	default: '',
	description: 'Decentralized identifier of the asset',
},
{
	displayName: 'Service ID',
	name: 'serviceId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['provider'],
			operation: ['getFileInfo'],
		},
	},
	default: '',
	description: 'The service identifier for the asset',
},
{
	displayName: 'User Address',
	name: 'userAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['provider'],
			operation: ['getNonce'],
		},
	},
	default: '',
	description: 'The wallet address of the user',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'asset':
        return [await executeAssetOperations.call(this, items)];
      case 'datatoken':
        return [await executeDatatokenOperations.call(this, items)];
      case 'computeJob':
        return [await executeComputeJobOperations.call(this, items)];
      case 'veOcean':
        return [await executeVeOceanOperations.call(this, items)];
      case 'order':
        return [await executeOrderOperations.call(this, items)];
      case 'provider':
        return [await executeProviderOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAssetOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('oceanprotocolApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createAsset': {
          const did = this.getNodeParameter('did', i) as string;
          const metadata = this.getNodeParameter('metadata', i) as any;
          const services = this.getNodeParameter('services', i) as any;

          const body = {
            did,
            metadata: typeof metadata === 'string' ? JSON.parse(metadata) : metadata,
            services: typeof services === 'string' ? JSON.parse(services) : services
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/aquarius/assets/ddo`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAsset': {
          const did = this.getNodeParameter('did', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/aquarius/assets/ddo/${did}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllAssets': {
          const page = this.getNodeParameter('page', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const sort = this.getNodeParameter('sort', i) as string;
          const asc = this.getNodeParameter('asc', i) as boolean;

          const queryParams = new URLSearchParams();
          if (page) queryParams.append('page', page.toString());
          if (offset) queryParams.append('offset', offset.toString());
          if (sort) queryParams.append('sort', sort);
          queryParams.append('asc', asc.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/aquarius/assets?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateAsset': {
          const did = this.getNodeParameter('did', i) as string;
          const metadata = this.getNodeParameter('metadata', i) as any;

          const body = {
            metadata: typeof metadata === 'string' ? JSON.parse(metadata) : metadata
          };

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/api/aquarius/assets/ddo/${did}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteAsset': {
          const did = this.getNodeParameter('did', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/api/aquarius/assets/ddo/${did}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'queryAssets': {
          const query = this.getNodeParameter('query', i) as any;
          const sort = this.getNodeParameter('sort', i) as string;
          const offset = this.getNodeParameter('offset', i) as number;
          const page = this.getNodeParameter('page', i) as number;

          const body = {
            query: typeof query === 'string' ? JSON.parse(query) : query,
            sort,
            offset,
            page
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/aquarius/assets/query`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw new NodeApiError(this.getNode(), error, { itemIndex: i });
      }
    }
  }

  return returnData;
}

async function executeDatatokenOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('oceanprotocolApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createDatatoken': {
					const name = this.getNodeParameter('name', i) as string;
					const symbol = this.getNodeParameter('symbol', i) as string;
					const templateIndex = this.getNodeParameter('templateIndex', i) as number;
					const minter = this.getNodeParameter('minter', i) as string;
					const cap = this.getNodeParameter('cap', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/api/aquarius/datatokens`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							name,
							symbol,
							templateIndex,
							minter,
							cap,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getDatatoken': {
					const address = this.getNodeParameter('address', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/api/aquarius/datatokens/${address}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAllDatatokens': {
					const chainId = this.getNodeParameter('chainId', i, '') as string;
					const owner = this.getNodeParameter('owner', i, '') as string;
					const page = this.getNodeParameter('page', i, 1) as number;
					const offset = this.getNodeParameter('offset', i, 100) as number;

					const queryParams = new URLSearchParams();
					if (chainId) queryParams.append('chainId', chainId);
					if (owner) queryParams.append('owner', owner);
					queryParams.append('page', page.toString());
					queryParams.append('offset', offset.toString());

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/api/aquarius/datatokens?${queryParams.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateDatatoken': {
					const address = this.getNodeParameter('address', i) as string;
					const cap = this.getNodeParameter('cap', i) as string;
					const minter = this.getNodeParameter('minter', i) as string;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/api/aquarius/datatokens/${address}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							cap,
							minter,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'mintDatatoken': {
					const address = this.getNodeParameter('address', i) as string;
					const amount = this.getNodeParameter('amount', i) as string;
					const to = this.getNodeParameter('to', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/api/aquarius/datatokens/${address}/mint`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							amount,
							to,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
						itemIndex: i,
					});
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw new NodeApiError(this.getNode(), error, { itemIndex: i });
			}
		}
	}

	return returnData;
}

async function executeComputeJobOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('oceanprotocolApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createComputeJob': {
					const signature = this.getNodeParameter('signature', i) as string;
					const documentId = this.getNodeParameter('documentId', i) as string;
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					const consumerAddress = this.getNodeParameter('consumerAddress', i) as string;
					const jobId = this.getNodeParameter('jobId', i) as string;
					const output = this.getNodeParameter('output', i) as object;

					const body: any = {
						signature,
						documentId,
						serviceId,
						consumerAddress,
						jobId,
						output,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/api/services/compute`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getComputeJob': {
					const signature = this.getNodeParameter('signature', i) as string;
					const documentId = this.getNodeParameter('documentId', i) as string;
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					const consumerAddress = this.getNodeParameter('consumerAddress', i) as string;
					const jobId = this.getNodeParameter('jobId', i) as string;

					const params = new URLSearchParams({
						signature,
						documentId,
						serviceId,
						consumerAddress,
						jobId,
					});

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/api/services/compute?${params.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAllComputeJobs': {
					const signature = this.getNodeParameter('signature', i) as string;
					const consumerAddress = this.getNodeParameter('consumerAddress', i) as string;

					const params = new URLSearchParams({
						signature,
						consumerAddress,
					});

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/api/services/compute?${params.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateComputeJob': {
					const signature = this.getNodeParameter('signature', i) as string;
					const documentId = this.getNodeParameter('documentId', i) as string;
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					const consumerAddress = this.getNodeParameter('consumerAddress', i) as string;
					const jobId = this.getNodeParameter('jobId', i) as string;
					const action = this.getNodeParameter('action', i) as string;

					const body: any = {
						signature,
						documentId,
						serviceId,
						consumerAddress,
						jobId,
						action,
					};

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/api/services/compute`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteComputeJob': {
					const signature = this.getNodeParameter('signature', i) as string;
					const documentId = this.getNodeParameter('documentId', i) as string;
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					const consumerAddress = this.getNodeParameter('consumerAddress', i) as string;
					const jobId = this.getNodeParameter('jobId', i) as string;

					const body: any = {
						signature,
						documentId,
						serviceId,
						consumerAddress,
						jobId,
					};

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/api/services/compute`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw new NodeApiError(this.getNode(), error, { itemIndex: i });
			}
		}
	}

	return returnData;
}

async function executeVeOceanOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('oceanprotocolApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getVeOceanLocks': {
          const user = this.getNodeParameter('user', i) as string;
          const chainId = this.getNodeParameter('chainId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/aquarius/veocean/locks/${user}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            qs: {
              chainId: chainId
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createVeOceanLock': {
          const amount = this.getNodeParameter('amount', i) as string;
          const unlockTime = this.getNodeParameter('unlockTime', i) as string;
          const user = this.getNodeParameter('user', i) as string;

          const body = {
            amount: amount,
            unlockTime: new Date(unlockTime).getTime() / 1000,
            user: user
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/aquarius/veocean/locks`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: body,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getVeOceanRewards': {
          const user = this.getNodeParameter('user', i) as string;
          const chainId = this.getNodeParameter('chainId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/aquarius/veocean/rewards/${user}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            qs: {
              chainId: chainId
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'claimVeOceanRewards': {
          const user = this.getNodeParameter('user', i) as string;
          const amounts = this.getNodeParameter('amounts', i) as string;
          const chainId = this.getNodeParameter('chainId', i) as string;

          const body = {
            user: user,
            amounts: amounts.split(',').map((amount: string) => amount.trim()),
            chainId: chainId
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/aquarius/veocean/claim`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: body,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllVeOceanAllocations': {
          const chainId = this.getNodeParameter('chainId', i) as string;
          const epoch = this.getNodeParameter('epoch', i) as number;

          const qs: any = {
            chainId: chainId
          };

          if (epoch && epoch > 0) {
            qs.epoch = epoch;
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/aquarius/veocean/allocations`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            qs: qs,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw new NodeApiError(this.getNode(), error, { itemIndex: i });
      }
    }
  }

  return returnData;
}

async function executeOrderOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('oceanprotocolApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createOrder': {
					const documentId = this.getNodeParameter('documentId', i) as string;
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					const consumerAddress = this.getNodeParameter('consumerAddress', i) as string;
					const signature = this.getNodeParameter('signature', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/api/services/order`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
						body: {
							documentId,
							serviceId,
							consumerAddress,
							signature,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getOrder': {
					const txId = this.getNodeParameter('txId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/api/services/order/${txId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAllOrders': {
					const consumerAddress = this.getNodeParameter('consumerAddress', i) as string;
					const page = this.getNodeParameter('page', i, 1) as number;
					const offset = this.getNodeParameter('offset', i, 0) as number;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/api/services/orders/${consumerAddress}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						qs: {
							page,
							offset,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'downloadAsset': {
					const documentId = this.getNodeParameter('documentId', i) as string;
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					const fileIndex = this.getNodeParameter('fileIndex', i, 0) as number;
					const signature = this.getNodeParameter('signature', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/api/services/download`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
						body: {
							documentId,
							serviceId,
							fileIndex,
							signature,
						},
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'initializeAsset': {
					const documentId = this.getNodeParameter('documentId', i) as string;
					const serviceId = this.getNodeParameter('serviceId', i) as string;
					const signature = this.getNodeParameter('signature', i) as string;
					const consumerAddress = this.getNodeParameter('consumerAddress', i) as string;

					const options: any