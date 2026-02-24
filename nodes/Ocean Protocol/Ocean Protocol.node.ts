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
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'DataNFTs',
            value: 'dataNFTs',
          },
          {
            name: 'Datatokens',
            value: 'datatokens',
          },
          {
            name: 'ComputeToData',
            value: 'computeToData',
          },
          {
            name: 'VeOcean',
            value: 'veOcean',
          },
          {
            name: 'AssetMetadata',
            value: 'assetMetadata',
          }
        ],
        default: 'dataNFTs',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['dataNFTs'],
    },
  },
  options: [
    {
      name: 'Create Data NFT',
      value: 'createDataNFT',
      description: 'Create a new Data NFT with metadata',
      action: 'Create data NFT',
    },
    {
      name: 'Get Data NFT',
      value: 'getDataNFT',
      description: 'Retrieve Data NFT metadata by DID',
      action: 'Get data NFT',
    },
    {
      name: 'Search Data NFTs',
      value: 'searchDataNFTs',
      description: 'Search and filter Data NFTs',
      action: 'Search data NFTs',
    },
    {
      name: 'Update Data NFT',
      value: 'updateDataNFT',
      description: 'Update Data NFT metadata',
      action: 'Update data NFT',
    },
    {
      name: 'Delete Data NFT',
      value: 'deleteDataNFT',
      description: 'Remove Data NFT from registry',
      action: 'Delete data NFT',
    },
  ],
  default: 'createDataNFT',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['datatokens'],
    },
  },
  options: [
    {
      name: 'Create Datatoken',
      value: 'createDatatoken',
      description: 'Create datatoken for data access',
      action: 'Create datatoken',
    },
    {
      name: 'Get Datatoken',
      value: 'getDatatoken',
      description: 'Get datatoken details by DID',
      action: 'Get datatoken details',
    },
    {
      name: 'Search Datatokens',
      value: 'searchDatatokens',
      description: 'Query datatokens by various criteria',
      action: 'Search datatokens',
    },
    {
      name: 'Purchase Datatoken',
      value: 'purchaseDatatoken',
      description: 'Purchase datatoken access',
      action: 'Purchase datatoken',
    },
    {
      name: 'Get Compute Environments',
      value: 'getComputeEnvironments',
      description: 'Get available compute environments',
      action: 'Get compute environments',
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
      resource: ['computeToData'],
    },
  },
  options: [
    {
      name: 'Start Compute Job',
      value: 'startComputeJob',
      description: 'Start a compute-to-data job',
      action: 'Start compute job',
    },
    {
      name: 'Get Compute Jobs',
      value: 'getComputeJobs',
      description: 'List compute jobs for user',
      action: 'Get compute jobs',
    },
    {
      name: 'Get Compute Job',
      value: 'getComputeJob',
      description: 'Get specific compute job details',
      action: 'Get compute job',
    },
    {
      name: 'Stop Compute Job',
      value: 'stopComputeJob',
      description: 'Stop a running compute job',
      action: 'Stop compute job',
    },
    {
      name: 'Delete Compute Job',
      value: 'deleteComputeJob',
      description: 'Delete compute job and results',
      action: 'Delete compute job',
    },
    {
      name: 'Get Compute Results',
      value: 'getComputeResults',
      description: 'Download compute job results',
      action: 'Get compute results',
    },
  ],
  default: 'startComputeJob',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['veOcean'],
    },
  },
  options: [
    {
      name: 'Get VeOcean Stats',
      value: 'getVeOceanStats',
      description: 'Query veOCEAN related statistics and allocations',
      action: 'Get veOCEAN stats',
    },
    {
      name: 'Allocate VeOcean',
      value: 'allocateVeOcean',
      description: 'Allocate veOCEAN to data assets',
      action: 'Allocate veOCEAN',
    },
    {
      name: 'Get VeOcean Allocations',
      value: 'getVeOceanAllocations',
      description: 'Get veOCEAN allocations for specific asset',
      action: 'Get veOCEAN allocations',
    },
    {
      name: 'Get Rewards',
      value: 'getRewards',
      description: 'Get rewards information for veOCEAN holders',
      action: 'Get rewards',
    },
    {
      name: 'Claim Rewards',
      value: 'claimRewards',
      description: 'Claim available rewards from veOCEAN allocations',
      action: 'Claim rewards',
    },
  ],
  default: 'getVeOceanStats',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['assetMetadata'],
    },
  },
  options: [
    {
      name: 'Get Metadata',
      value: 'getMetadata',
      description: 'Retrieve asset metadata by DID',
      action: 'Get asset metadata',
    },
    {
      name: 'Search Metadata',
      value: 'searchMetadata',
      description: 'Advanced metadata search with filters',
      action: 'Search asset metadata',
    },
    {
      name: 'Validate Asset Name',
      value: 'validateAssetName',
      description: 'Check asset name availability',
      action: 'Validate asset name',
    },
    {
      name: 'Get Supported Chains',
      value: 'getSupportedChains',
      description: 'Get list of supported blockchain networks',
      action: 'Get supported chains',
    },
    {
      name: 'Get Protocol Stats',
      value: 'getProtocolStats',
      description: 'Get Ocean Protocol network statistics',
      action: 'Get protocol statistics',
    },
  ],
  default: 'getMetadata',
},
      // Parameter definitions
{
  displayName: 'Metadata',
  name: 'metadata',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['dataNFTs'],
      operation: ['createDataNFT'],
    },
  },
  default: '{}',
  description: 'The metadata for the Data NFT',
},
{
  displayName: 'Services',
  name: 'services',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['dataNFTs'],
      operation: ['createDataNFT'],
    },
  },
  default: '[]',
  description: 'The services configuration for the Data NFT',
},
{
  displayName: 'Credentials',
  name: 'credentials',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['dataNFTs'],
      operation: ['createDataNFT'],
    },
  },
  default: '{}',
  description: 'The credentials required for creating the Data NFT',
},
{
  displayName: 'DID',
  name: 'did',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['dataNFTs'],
      operation: ['getDataNFT'],
    },
  },
  default: '',
  description: 'The Decentralized Identifier (DID) of the Data NFT',
},
{
  displayName: 'Query',
  name: 'query',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['dataNFTs'],
      operation: ['searchDataNFTs'],
    },
  },
  default: '{}',
  description: 'The search query parameters',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['dataNFTs'],
      operation: ['searchDataNFTs'],
    },
  },
  default: 0,
  description: 'The number of items to skip in the result set',
},
{
  displayName: 'Size',
  name: 'size',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['dataNFTs'],
      operation: ['searchDataNFTs'],
    },
  },
  default: 25,
  description: 'The maximum number of items to return',
},
{
  displayName: 'Sort',
  name: 'sort',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['dataNFTs'],
      operation: ['searchDataNFTs'],
    },
  },
  default: '{}',
  description: 'The sort criteria for the search results',
},
{
  displayName: 'DID',
  name: 'did',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['dataNFTs'],
      operation: ['updateDataNFT'],
    },
  },
  default: '',
  description: 'The Decentralized Identifier (DID) of the Data NFT to update',
},
{
  displayName: 'Metadata',
  name: 'metadata',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['dataNFTs'],
      operation: ['updateDataNFT'],
    },
  },
  default: '{}',
  description: 'The updated metadata for the Data NFT',
},
{
  displayName: 'Credentials',
  name: 'credentials',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['dataNFTs'],
      operation: ['updateDataNFT'],
    },
  },
  default: '{}',
  description: 'The credentials required for updating the Data NFT',
},
{
  displayName: 'DID',
  name: 'did',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['dataNFTs'],
      operation: ['deleteDataNFT'],
    },
  },
  default: '',
  description: 'The Decentralized Identifier (DID) of the Data NFT to delete',
},
{
  displayName: 'Credentials',
  name: 'credentials',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['dataNFTs'],
      operation: ['deleteDataNFT'],
    },
  },
  default: '{}',
  description: 'The credentials required for deleting the Data NFT',
},
{
  displayName: 'Data Token Options',
  name: 'dataTokenOptions',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['datatokens'],
      operation: ['createDatatoken'],
    },
  },
  default: '{}',
  description: 'Configuration options for the datatoken creation',
},
{
  displayName: 'Fixed Price Options',
  name: 'fixedPriceOptions',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['datatokens'],
      operation: ['createDatatoken'],
    },
  },
  default: '{}',
  description: 'Fixed price configuration for the datatoken',
},
{
  displayName: 'DID',
  name: 'did',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['datatokens'],
      operation: ['getDatatoken', 'purchaseDatatoken', 'getComputeEnvironments'],
    },
  },
  default: '',
  description: 'The Decentralized Identifier (DID) of the data asset',
},
{
  displayName: 'Query',
  name: 'query',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['datatokens'],
      operation: ['searchDatatokens'],
    },
  },
  default: '{}',
  description: 'Search query parameters for finding datatokens',
},
{
  displayName: 'Data Token Address',
  name: 'dataTokenAddress',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['datatokens'],
      operation: ['searchDatatokens'],
    },
  },
  default: '',
  description: 'Specific datatoken contract address to filter by',
},
{
  displayName: 'Consumer Address',
  name: 'consumerAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['datatokens'],
      operation: ['purchaseDatatoken'],
    },
  },
  default: '',
  description: 'Ethereum address of the datatoken consumer',
},
{
  displayName: 'Service Index',
  name: 'serviceIndex',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['datatokens'],
      operation: ['purchaseDatatoken'],
    },
  },
  default: 0,
  description: 'Index of the service to purchase access to',
},
{
  displayName: 'Dataset DID',
  name: 'dataset',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['computeToData'],
      operation: ['startComputeJob'],
    },
  },
  default: '',
  description: 'The DID of the dataset to compute on',
},
{
  displayName: 'Algorithm DID',
  name: 'algorithm',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['computeToData'],
      operation: ['startComputeJob'],
    },
  },
  default: '',
  description: 'The DID of the algorithm to run',
},
{
  displayName: 'Compute Environment',
  name: 'compute',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['computeToData'],
      operation: ['startComputeJob'],
    },
  },
  default: '{}',
  description: 'Compute environment configuration as JSON',
},
{
  displayName: 'Consumer Address',
  name: 'consumerAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['computeToData'],
      operation: ['startComputeJob', 'getComputeJobs', 'getComputeJob', 'stopComputeJob', 'deleteComputeJob', 'getComputeResults'],
    },
  },
  default: '',
  description: 'The Ethereum address of the consumer',
},
{
  displayName: 'Job ID',
  name: 'jobId',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['computeToData'],
      operation: ['getComputeJobs'],
    },
  },
  default: '',
  description: 'Optional job ID to filter results',
},
{
  displayName: 'Job ID',
  name: 'jobId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['computeToData'],
      operation: ['getComputeJob', 'stopComputeJob', 'deleteComputeJob', 'getComputeResults'],
    },
  },
  default: '',
  description: 'The ID of the compute job',
},
{
  displayName: 'Output Index',
  name: 'index',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['computeToData'],
      operation: ['getComputeResults'],
    },
  },
  default: 0,
  description: 'Index of the output file to download',
},
{
  displayName: 'Query',
  name: 'query',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['getVeOceanStats'],
    },
  },
  default: '',
  description: 'Query parameters for veOCEAN statistics',
},
{
  displayName: 'VE Allocate',
  name: 'veAllocate',
  type: 'boolean',
  required: false,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['getVeOceanStats'],
    },
  },
  default: false,
  description: 'Whether to include allocation data in the response',
},
{
  displayName: 'Allocation',
  name: 'allocation',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['allocateVeOcean'],
    },
  },
  default: '{}',
  description: 'Allocation parameters for veOCEAN tokens',
},
{
  displayName: 'User Data',
  name: 'userData',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['allocateVeOcean'],
    },
  },
  default: '{}',
  description: 'Additional user data for the allocation',
},
{
  displayName: 'DID',
  name: 'did',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['getVeOceanAllocations', 'claimRewards'],
    },
  },
  default: '',
  description: 'Decentralized Identifier of the data asset',
},
{
  displayName: 'Chain IDs',
  name: 'chainIds',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['getRewards'],
    },
  },
  default: '',
  description: 'Comma-separated list of chain IDs to query rewards for',
},
{
  displayName: 'Consumer Address',
  name: 'consumerAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['veOcean'],
      operation: ['claimRewards'],
    },
  },
  default: '',
  description: 'Ethereum address of the consumer claiming rewards',
},
{
  displayName: 'DID',
  name: 'did',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['assetMetadata'],
      operation: ['getMetadata'],
    },
  },
  default: '',
  description: 'The Decentralized Identifier (DID) of the asset',
},
{
  displayName: 'Query',
  name: 'query',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['assetMetadata'],
      operation: ['searchMetadata'],
    },
  },
  default: '{}',
  description: 'Search query object',
},
{
  displayName: 'Filters',
  name: 'filters',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['assetMetadata'],
      operation: ['searchMetadata'],
    },
  },
  default: '{}',
  description: 'Search filters to apply',
},
{
  displayName: 'Sort',
  name: 'sort',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['assetMetadata'],
      operation: ['searchMetadata'],
    },
  },
  default: '{}',
  description: 'Sort options for search results',
},
{
  displayName: 'Asset Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['assetMetadata'],
      operation: ['validateAssetName'],
    },
  },
  default: '',
  description: 'The asset name to validate availability',
},
{
  displayName: 'Chain IDs',
  name: 'chainIds',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['assetMetadata'],
      operation: ['getProtocolStats'],
    },
  },
  default: '',
  description: 'Comma-separated list of chain IDs to filter statistics',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'dataNFTs':
        return [await executeDataNFTsOperations.call(this, items)];
      case 'datatokens':
        return [await executeDatatokensOperations.call(this, items)];
      case 'computeToData':
        return [await executeComputeToDataOperations.call(this, items)];
      case 'veOcean':
        return [await executeVeOceanOperations.call(this, items)];
      case 'assetMetadata':
        return [await executeAssetMetadataOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeDataNFTsOperations(
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
        case 'createDataNFT': {
          const metadata = this.getNodeParameter('metadata', i) as any;
          const services = this.getNodeParameter('services', i) as any;
          const ddoCredentials = this.getNodeParameter('credentials', i) as any;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/aquarius/assets/ddo`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            body: {
              metadata: metadata,
              services: services,
              credentials: ddoCredentials,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDataNFT': {
          const did = this.getNodeParameter('did', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/aquarius/assets/ddo/${did}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'searchDataNFTs': {
          const query = this.getNodeParameter('query', i) as any;
          const offset = this.getNodeParameter('offset', i) as number;
          const size = this.getNodeParameter('size', i) as number;
          const sort = this.getNodeParameter('sort', i) as any;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/aquarius/assets/query`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            qs: {
              query: JSON.stringify(query),
              offset: offset,
              size: size,
              sort: JSON.stringify(sort),
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateDataNFT': {
          const did = this.getNodeParameter('did', i) as string;
          const metadata = this.getNodeParameter('metadata', i) as any;
          const ddoCredentials = this.getNodeParameter('credentials', i) as any;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/api/aquarius/assets/ddo/${did}`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            body: {
              metadata: metadata,
              credentials: ddoCredentials,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteDataNFT': {
          const did = this.getNodeParameter('did', i) as string;
          const ddoCredentials = this.getNodeParameter('credentials', i) as any;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/api/aquarius/assets/ddo/${did}`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            body: {
              credentials: ddoCredentials,
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

      returnData.push({ json: result, pairedItem: { item: i } });
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

async function executeDatatokensOperations(
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
          const dataTokenOptions = this.getNodeParameter('dataTokenOptions', i) as any;
          const fixedPriceOptions = this.getNodeParameter('fixedPriceOptions', i, {}) as any;

          const body: any = {
            dataTokenOptions: typeof dataTokenOptions === 'string' ? JSON.parse(dataTokenOptions) : dataTokenOptions,
            fixedPriceOptions: typeof fixedPriceOptions === 'string' ? JSON.parse(fixedPriceOptions) : fixedPriceOptions,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/aquarius/assets/ddo`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            body: body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDatatoken': {
          const did = this.getNodeParameter('did', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/aquarius/assets/ddo/${encodeURIComponent(did)}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'searchDatatokens': {
          const query = this.getNodeParameter('query', i) as any;
          const dataTokenAddress = this.getNodeParameter('dataTokenAddress', i, '') as string;

          const queryParams: any = {
            query: typeof query === 'string' ? JSON.parse(query) : query,
          };

          if (dataTokenAddress) {
            queryParams.dataTokenAddress = dataTokenAddress;
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/aquarius/assets/query`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            qs: queryParams,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'purchaseDatatoken': {
          const did = this.getNodeParameter('did', i) as string;
          const consumerAddress = this.getNodeParameter('consumerAddress', i) as string;
          const serviceIndex = this.getNodeParameter('serviceIndex', i, 0) as number;

          const body: any = {
            consumerAddress,
            serviceIndex,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/aquarius/assets/ddo/${encodeURIComponent(did)}/order`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            body: body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getComputeEnvironments': {
          const did = this.getNodeParameter('did', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/aquarius/assets/ddo/${encodeURIComponent(did)}/computeEnvironments`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
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
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeComputeToDataOperations(
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
        case 'startComputeJob': {
          const dataset = this.getNodeParameter('dataset', i) as string;
          const algorithm = this.getNodeParameter('algorithm', i) as string;
          const compute = this.getNodeParameter('compute', i) as string;
          const consumerAddress = this.getNodeParameter('consumerAddress', i) as string;

          const requestBody: any = {
            dataset,
            algorithm,
            compute: typeof compute === 'string' ? JSON.parse(compute) : compute,
            consumerAddress,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/services/compute`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getComputeJobs': {
          const consumerAddress = this.getNodeParameter('consumerAddress', i) as string;
          const jobId = this.getNodeParameter('jobId', i) as string;

          const queryParams: any = {
            consumerAddress,
          };

          if (jobId) {
            queryParams.jobId = jobId;
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/services/compute`,
            qs: queryParams,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getComputeJob': {
          const jobId = this.getNodeParameter('jobId', i) as string;
          const consumerAddress = this.getNodeParameter('consumerAddress', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/services/compute/${jobId}`,
            qs: {
              consumerAddress,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'stopComputeJob': {
          const jobId = this.getNodeParameter('jobId', i) as string;
          const consumerAddress = this.getNodeParameter('consumerAddress', i) as string;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/api/services/compute/${jobId}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              consumerAddress,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteComputeJob': {
          const jobId = this.getNodeParameter('jobId', i) as string;
          const consumerAddress = this.getNodeParameter('consumerAddress', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/api/services/compute/${jobId}`,
            qs: {
              consumerAddress,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getComputeResults': {
          const jobId = this.getNodeParameter('jobId', i) as string;
          const consumerAddress = this.getNodeParameter('consumerAddress', i) as string;
          const index = this.getNodeParameter('index', i) as number;

          const queryParams: any = {
            consumerAddress,
          };

          if (index !== undefined) {
            queryParams.index = index;
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/services/compute/${jobId}/output`,
            qs: queryParams,
            encoding: null,
            json: false,
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
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
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
        case 'getVeOceanStats': {
          const query = this.getNodeParameter('query', i) as string;
          const veAllocate = this.getNodeParameter('veAllocate', i) as boolean;
          
          const queryParams: any = {
            query: query,
          };
          
          if (veAllocate !== undefined) {
            queryParams.veAllocate = veAllocate;
          }
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/aquarius/assets/query`,
            qs: queryParams,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'allocateVeOcean': {
          const allocation = this.getNodeParameter('allocation', i) as string;
          const userData = this.getNodeParameter('userData', i) as string;
          
          let allocationData: any;
          let userDataParsed: any;
          
          try {
            allocationData = typeof allocation === 'string' ? JSON.parse(allocation) : allocation;
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid JSON in allocation parameter: ${error.message}`);
          }
          
          try {
            userDataParsed = userData ? (typeof userData === 'string' ? JSON.parse(userData) : userData) : {};
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid JSON in userData parameter: ${error.message}`);
          }
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/aquarius/assets/ddo`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              allocation: allocationData,
              userData: userDataParsed,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getVeOceanAllocations': {
          const did = this.getNodeParameter('did', i) as string;
          
          if (!did) {
            throw new NodeOperationError(this.getNode(), 'DID is required for getting veOCEAN allocations');
          }
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/aquarius/assets/ddo/${did}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getRewards': {
          const chainIds = this.getNodeParameter('chainIds', i) as string;
          
          const queryParams: any = {};
          if (chainIds) {
            queryParams.chainIds = chainIds;
          }
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/aquarius/stats`,
            qs: queryParams,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'claimRewards': {
          const did = this.getNodeParameter('did', i) as string;
          const consumerAddress = this.getNodeParameter('consumerAddress', i) as string;
          
          if (!did) {
            throw new NodeOperationError(this.getNode(), 'DID is required for claiming rewards');
          }
          
          if (!consumerAddress) {
            throw new NodeOperationError(this.getNode(), 'Consumer address is required for claiming rewards');
          }
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/aquarius/assets/ddo/${did}/order`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              consumerAddress: consumerAddress,
            },
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
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }
  
  return returnData;
}

async function executeAssetMetadataOperations(
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
        case 'getMetadata': {
          const did = this.getNodeParameter('did', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/aquarius/assets/metadata/${did}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'searchMetadata': {
          const query = this.getNodeParameter('query', i) as any;
          const filters = this.getNodeParameter('filters', i, {}) as any;
          const sort = this.getNodeParameter('sort', i, {}) as any;
          
          let searchQuery: any;
          if (typeof query === 'string') {
            try {
              searchQuery = JSON.parse(query);
            } catch (error: any) {
              throw new NodeOperationError(this.getNode(), `Invalid JSON in query parameter: ${error.message}`);
            }
          } else {
            searchQuery = query;
          }
          
          let searchFilters: any = {};
          if (typeof filters === 'string') {
            try {
              searchFilters = JSON.parse(filters);
            } catch (error: any) {
              throw new NodeOperationError(this.getNode(), `Invalid JSON in filters parameter: ${error.message}`);
            }
          } else {
            searchFilters = filters;
          }
          
          let sortOptions: any = {};
          if (typeof sort === 'string') {
            try {
              sortOptions = JSON.parse(sort);
            } catch (error: any) {
              throw new NodeOperationError(this.getNode(), `Invalid JSON in sort parameter: ${error.message}`);
            }
          } else {
            sortOptions = sort;
          }
          
          const requestBody: any = {
            query: searchQuery,
            ...searchFilters,
            ...sortOptions,
          };
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/aquarius/assets/metadata/query`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'validateAssetName': {
          const name = this.getNodeParameter('name', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/aquarius/assets/names`,
            headers: {
              'Content-Type': 'application/json',
            },
            qs: {
              name: name,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getSupportedChains': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/aquarius/chains/list`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getProtocolStats': {
          const chainIds = this.getNodeParameter('chainIds', i, '') as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/aquarius/stats`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          if (chainIds) {
            options.qs = {
              chainIds: chainIds,
            };
          }
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { 
            error: error.message,
            operation: operation,
            item: i 
          }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }
  
  return returnData;
}
